export default async function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({
error:"Method not allowed"
});
}

res.status(200).json({

hts:"7612.90.1090",
duty:"5.7%",
section301:"Additional 25%",
bond:"Continuous Bond Recommended",
status:"Ready for Broker Review"

});

}

if(req.method!=="POST"){
return res.status(405).json({
error:"Method not allowed"
});
}

res.status(200).json({

hts:"7612.90.1090",
duty:"5.7%",
section301:"Additional 25%",
bond:"Continuous Bond Recommended",
status:"Ready for Broker Review"

});

}
