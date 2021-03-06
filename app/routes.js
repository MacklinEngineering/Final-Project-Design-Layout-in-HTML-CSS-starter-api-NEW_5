module.exports = function (app, passport, db) {

  const ObjectId = require('mongodb').ObjectID


  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });
  app.get('/index', function (req, res) {
    res.render('index.ejs');
  });

  app.get('/post-job', function (req, res) {
    res.render('post-job.ejs');
  })

  app.get('/contact', function (req, res) {
    res.render('contact.ejs');
  })

  app.get('/about', function (req, res) {
    res.render('about.ejs');
  })

  // This code is altered from Socket.io's chat box tutorial
  app.get('/chat', function (req, res) {
    const id = req.query.id
    console.log("chat job id:", id)

    db.collection('Listings').findOne({
      _id: ObjectId(id)
    },(err, result) => {  //Find all posts then turn to array
    //   if (err) return console.log(err)
    console.log("Chat Find One Listing",result)
      // res.render('job-listings.ejs',{
      //   Listing: result
      // })
      res.render('chat.ejs', {
        Listing: result,
        email: req.user.local.email
      });
    })
  });


  app.get('/job-listings', function (req, res) {
    db.collection('Listings').find().toArray((err, result) => {  //Find all posts then turn to array
    //   if (err) return console.log(err)
    console.log(result)
      res.render('job-listings.ejs',{
        Listings: result
      })
    })
  })

  // app.get('/searchItems', function (req, res) {
  //   db.collection('Listings').find().toArray((err, result) => {  //Find all posts then turn to array
  //   //   if (err) return console.log(err)
  //   console.log(result)
  //     res.render('job-listings.ejs',{
  //       Listings: result
  //     })
  //   })
  // })


// app.get("job-listings", function (req, res, next){
//   db.collection('Listings').find().toArray((err, result) => {
// })

//This code is altered from Lokendra-rawat on Github- Thank You!
//https://github.com/Lokendra-rawat/NodeJs-shopping-cart/blob/master/routes/xhr.js
  app.get('/searchItems', function (req, res) {
    // var q = req.body.q
    // var q = "Masks"
	  var q = req.query.q;
    console.log(req.query)
      db.collection('Listings').find({
        itemTitle: q
      }).toArray((err, result) => {
        res.render('searchItems.ejs',{
            Listings: result
        })
    })
	// FULL TEXT SEARCH USING $text

	// db.collection('Listings').find({
	// 	$itemTitle: q
  //
	// }, {
	// 	_id: 0,
	// 	__v: 0
	// }, function (err, data) {
	// 	res.json(data);

	// });

	// PARTIAL TEXT SEARCH USING REGEX

	// db.collection('Listings').find({
	// 	Listings: {
	// 		$regex: new RegExp(q)
	// 	}
	// }, {
	// 	_id: 0,
	// 	__v: 0
	// }, function (err, data) {
	// 	res.json(data);
  //   res.render('searchItems.ejs');
	// }).limit(20);

});
// res.render('/');


  //   res.render('job-listings.ejs', {items: [{
  //     title: "Masks",
  //     city: "Boston",
  //     quantity: "300",
  //   },{
  //     title: "Hand Santizer",
  //     city: "Roxbury",
  //     quantity: "100",
  //   }]
  // })


    // })
  // })
  // // FEED PAGE =========================
  // app.get('/feed', function(req, res) {
  //     db.collection('posts').find().toArray((err, result) => {  //Find all posts then turn to array
  //       if (err) return console.log(err)
  //       res.render('feed.ejs', {   //render /feed
  //         user : req.user,
  //         posts: result
  //       })
  //     })
  // });


  app.get('/job-single', function (req, res) {
    const id = req.query.id
    console.log("job id:", id)

    db.collection('Listings').findOne({
      _id: ObjectId(id)
    },(err, result) => {  //Find all posts then turn to array
    //   if (err) return console.log(err)
    console.log("Find One Listing",result)
      // res.render('job-listings.ejs',{
      //   Listing: result
      // })
      res.render('job-single.ejs', {
        Listing: result
      });
    })
    //1. get id out of request
  })

  app.get('/services', function (req, res) {
    res.render('services.ejs');
  })

  app.get('/testimonials', function (req, res) {
    res.render('testimonials.ejs');
  })
  //     app.get('/', function (req, res){
  //         res.render('about.ejs')
  //     })
  //     app.get('/', function (req, res){
  //       res.render('blog-single.ejs')
  //   })
  //   app.get('/', function (req, res){
  //     res.render('contact.ejs')
  // })
  // app.get('/', function (req, res){
  //   res.render('faq.ejs')
  // })
  // app.get('/', function (req, res){
  //   res.render('job-listings.ejs')
  // })

// app.get("profile")


  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    db.collection('messages').find().toArray((err, result) => {
      if (err) return console.log(err)
      res.render('profile.ejs', {
        user: req.user,
        messages: result
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  app.post('/listings', (req, res) => {
    db.collection('Listings').save({ email: req.body.Email,
      itemTitle: req.body.ItemTitle, itemlocation: req.body.ItemLocation, itemdescription: req.body.ItemDescription}, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
    })

  })



  // app.post("/")

  // db.collection('messages').save({ name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown: 0 }, (err, result) => {
    //   if (err) return console.log(err)
    //   console.log('saved to database')
    //   res.redirect('/profile')
    // })
  // app.post('/messages', (req, res) => {
  //   db.collection('messages').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
  //     if (err) return console.log(err)
  //     console.log('saved to database')
  //     res.redirect('/profile')
  //   })
  // })

  // app.put('/messages', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp + 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  // app.put('/thumbDown', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp - 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  // app.delete('/messages', (req, res) => {
  //   db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
  //     if (err) return res.send(500, err)
  //     res.send('Message deleted!')
  //   })
  // })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
