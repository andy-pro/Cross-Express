var passport = require('passport'),
		T = require('./lexicon').T,
		Account = require('./models').account;

module.exports = function(req, res, next) {

	var act = req.params.action,
			result = { show: true },
			status, details;

	function login(msg) {

		/*
		// working, but no error message
		passport.authenticate('local')(req, res, function (arg1,arg2,arg3) {
			//res.redirect('/');
			console.log('=====',arg1,arg2,arg3);
			console.log('*********login**********', msg);
			res.send({
				show: true,
				status: true,
				details: msg
			});
		});
		*/
		//console.log('step1', req.user);

			passport.authenticate('local', function(err, user, info) {
				//console.log('===err===', err);
				//console.log('===user===', user);
				//console.log('===info===', info);

				/*
info is: { [IncorrectUsernameError: Password or username are incorrect]
  name: 'IncorrectUsernameError',
  message: 'Password or username are incorrect' }
				*/

		//console.log('step2', req.user);

				if (err) {
					console.log('auth error, oops!!! error:', err, 'info:', info);
					return next(err);
				}
				if (!user) {
					//return res.redirect('/login');
					return res.send({
						show: true,
						status: false,
						details: 'user not present!'
					});
				}
				req.login(user, function(err) {
					if (err) {
						console.log('login error, oops!!!', err);
						return next(err);
					}
					//return res.redirect('/users/' + user.username);
					//console.log('========#### step3', user);
					//console.log('========#### step4', req.user);
					// user = req.user, contains __v, email, last_name, first_name, _id, hash, salt
					//res.send({
					return res.send({
						show: true,
						status: true,
						details: msg,
						user: {
						  _id: user._id,
							first_name: user.first_name,
							last_name: user.last_name,
							email: user.email
						}
					});

				});
			})(req, res, next);


	}

	if (req.method === 'GET') {

		if (act == 'logout') {
		  console.log('user logout!');
			req.logout();
			res.send({_id: 0});
		} else
		if (act == 'info') {
  		var user = req.user; // contains __v, email, last_name, first_name, _id
			console.log('tratata', user);
			if (!user) user = {_id: 0};
			res.send(user);
		}

	} else

	if (req.method === 'POST') {

		if (act == 'register') {
			console.log(req.body);
			//var user = { first_name:req.body.first_name, last_name: req.body.last_name, email : req.body.email };
			//Account.register(new Account(user), req.body.password, function(err, account) {
			Account.register(new Account(req.body), req.body.password, function(err, account) {
				console.log('account', account);
				// account contains __v, email, last_name, first_name, _id, hash, salt
				if (err) {
					//return res.render('register', { account : account });
					console.log('error', err);
					res.send({
						show: true,
						status: false,
						details: err.message
					});
				} else {
					//passport.authenticate('local')(req, res, function () {
						////res.redirect('/');
						//res.send({
							//show: true,
							//status: true,
							//details: 'user registered and logged in'
						//});
					//});
					login('user registered and logged in');
				}
			});

		} else

		if (act == 'login') {
			login('user logged in');
/*
			passport.authenticate('local', function(err, user, info) {
				console.log('===info===', info);
				if (err) {
					console.log('auth error, oops!!!');
					return next(err);
				}
				if (!user) {
					//return res.redirect('/login');
					console.log('user not present!');
					return res.send({
						show: true,
						status: false,
						details: 'user not present!'
					});
				}
				req.login(user, function(err) {
					if (err) {
						console.log('login error, oops!!!');
						return next(err);
					}
					//return res.redirect('/users/' + user.username);
					return res.send({
						show: true,
						status: true,
						details: 'user logged in'
					});

				});
			})(req, res, next);
*/
		}
	}

}


