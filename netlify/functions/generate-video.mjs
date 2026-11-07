export default async (req) => {
 if(req.method!=="POST")return json({error:"Use POST."},405);
 let b;try{b=await req.json()}catch{return json({error:"Invalid request."},400)}
 const prompt=String(b.prompt||"").trim().slice(0,1200);if(!prompt)return json({error:"Please enter a prompt."},400);
 const token=process.env.REPLICATE_API_TOKEN,version=process.env.REPLICATE_VIDEO_VERSION;
 if(!token||!version)return json({error:"Video not configured. Add REPLICATE_API_TOKEN and REPLICATE_VIDEO_VERSION in Netlify. Video models may be paid."},503);
 try{
  const r=await fetch("https://api.replicate.com/v1/predictions",{method:"POST",headers:{Authorization:"Bearer "+token,"Content-Type":"application/json",Prefer:"wait=10"},body:JSON.stringify({version,input:{prompt:`${prompt}. Style: ${String(b.style||"Realistic")}. Aspect ratio: ${String(b.ratio||"16:9")}.`}})});
  const d=await r.json();if(!r.ok)return json({error:"Video provider error "+r.status+": "+(d.detail||d.title||"Check token/model/billing.")},502);
  if(d.status==="succeeded"){const out=Array.isArray(d.output)?d.output[0]:d.output;if(typeof out==="string")return json({videoUrl:out})}
  return json({error:"Video is still processing or the model returned no video. Check the selected model's input/output format and retry."},502)
 }catch{return json({error:"Could not reach video provider."},502)}
};
function json(d,s=200){return new Response(JSON.stringify(d),{status:s,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}})}
