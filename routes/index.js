const express = require('express');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const companyList = mongoose.model('companyList');
var request = require('request');
var cheerio = require('cheerio');


const router = express.Router();

router.get('/', (req, res) => {
  res.render('form', { title: 'Search Company' });
});
router.post('/company-list',[
    check('company_name')
    .isLength({ min: 2 })
    .withMessage('Please enter a company name'),
 ], (req, res) => {
     const errors = validationResult(req);

    if (errors.isEmpty()) {
    const scrapedData = [];
    url = 'https://www.zaubacorp.com/companysearchresults/' + JSON.stringify(req.body.company_name);
    
 request(url, function(error, response, html){
 if(!error){
 var $ = cheerio.load(html);
     if($('#results').length != 0){
    	console.log("inif");
    	$('html').filter(function(){
        $('table > tbody > tr').each((index, element) => {
            if (index === 0) return true;
            const tds = $(element).find('td');
            const cin = $(tds[0]).text();
            const company_name = $(tds[1]).text();
            const tableRow = { cin,company_name };
            scrapedData.push(tableRow);
        });
        // console.log(scrapedData);
  })
  if(req.body.save == "save-to-db"){
    companyList.insertMany(scrapedData)  
    .then((result) => {
            console.log(result.length,"new documents added!");
            // res.status(200).json({'success': 'new documents added!', 'data': result.length});
    })
    .catch(err => {
            console.error("error ", err);
            res.status(400).json({err});
    });
}
 res.render('company_list',{title: req.body.company_name+" | Company List", scrapedData:scrapedData,cname:req.body.company_name});
    }
    else
    	res.status(404).send('Company Not Found!');
 
    }
})

    } else {
      res.render('form', {
        title: 'Search Company',
        errors: errors.array(),
        data: req.body,
      });
    }
});
router.get('/company-list',(req,res)=>{
    res.render('company_list',{title:"Not found | Company List"});
});

module.exports = router;