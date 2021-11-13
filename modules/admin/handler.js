exports.createAdmin = (req, res)=>{
    let admin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    admin.save((err, admin)=>{
        if(err){
            res.send(err);
        }
        res.json(admin);
    });

}