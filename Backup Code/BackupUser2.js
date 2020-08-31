  //Add User
  AddUser(Userdata, callback) {
    console.log(Userdata);
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(Userdata["password"], salt, function (err, hash) {
        Userdata["password"] = hash;
        User.insert(
          {
            username: Userdata["username"],
            password: Userdata["password"],
            first_name: Userdata["firstname"],
            last_name: Userdata["lastname"],
            email: Userdata["email"],
          },
          function (err, success) {
            if (err) throw err;
          }
        );
      });
    });
  }


  //Route
  Userdata = [];
  (Userdata["username"] = req.body.username),
    (Userdata["password"] = req.body.password),
    (Userdata["firstname"] = req.body.firstname),
    (Userdata["lastname"] = req.body.lastname),
    (Userdata["email"] = req.body.email);