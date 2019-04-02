const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);


router.get('/add', (req, res) => {
	if(req.user){
	res.render('add');
}


else
{
req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
}

	
});
router.get('/index1', (req, res) => {
	 //if(req.user){
	res.render('index1');
 //}
});
module.exports = router;