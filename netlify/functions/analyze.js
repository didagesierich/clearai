export default async (req) => {

const body = await req.json()
const text = body.text

const response = await fetch("https://api.openai.com/v1/chat/completions",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":"Bearer " + process.env.OPENAI_API_KEY
},

body:JSON.stringify({
model:"gpt-4o-mini",
messages:[
{
role:"system",
content:"Analyze AI governance risks and return JSON with risk_level, issues and recommendations."
},
{
role:"user",
content:text
}
]
})

})

const data = await response.json()

const result = data.choices[0].message.content

return new Response(JSON.stringify({ result }),{
  headers:{ "Content-Type":"application/json" }
})
  
}
