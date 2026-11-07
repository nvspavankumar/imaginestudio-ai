export default async (req) => {
 if(req.method!=="POST") return json({error:"Use POST."},405);
 let b; try{b=await req.json()}catch{return json({error:"Invalid request."},400)}
 const prompt=String(b.prompt||"").trim().slice(0,1200); if(!prompt)return json({error:"Please enter a prompt."},400);
 const token=process.env.HF_TOKEN, model=process.env.HF_IMAGE_MODEL||"black-forest-labs/FLUX.1-schnell";
 if(!token)return json({error:"Image provider not configured. Add HF_TOKEN in Netlify environment variables."},503);
 try{
  const r=await fetch("https://router.huggingface.co/hf-inference/models/"+model,{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json",Accept:"image/png"},body:JSON.stringify({inputs:`${prompt}. Style: ${String(b.style||"Realistic")}. Aspect ratio: ${String(b.ratio||"1:1")}.`})});
  if(!r.ok)return json({error:"Image provider error "+r.status+": "+(await r.text()).slice(0,350)},502);
  const type=r.headers.get("content-type")||"image/png";if(!type.startsWith("image/"))return json({error:"Provider returned no image. Check model access."},502);
  const bytes=Buffer.from(await r.arrayBuffer());return json({imageUrl:`data:${type};base64,${bytes.toString("base64")}`});
 }catch{return json({error:"Could not reach image provider."},502)}
};
function json(d,s=200){return new Response(JSON.stringify(d),{status:s,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}})}
