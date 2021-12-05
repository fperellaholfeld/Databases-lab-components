const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', function(req, res, next) {
    res.setHeader('Content-Type', 'text/html');
    res.write('<title>Edible Textbooks Orders List</title>');
    res.write('<header><nav><ul><li><a href="/"> Home </a></li><li><a href="/listprod"> Find Products </a></li><li><a href="/showcart"> Your Cart </a></li><li> <a href="/listorder"> Past orders </a></li></ul></nav></header>');
    res.write('<style type=text/css> header {background-color: white; position: static; left: 0; right: 0;  top: 5px;  height: 30px;  display: flex;  align-items: center;  }  header * {  display: inline;  }  header li {  margin: 20px;  }  header li a {  color: blue;  text-decoration: none;  }  </style>');
    res.write('<h1 align="center"><font face="normal" color="#cf0921">Tasty Texts</font></h1><hr>');
    
    (async function() {
        try {
            let pool = await sql.connect(dbConfig);
            let results = false;
            //DONE: Use prepared Statement For Query
            const prep = new sql.PreparedStatement(pool)
            let sqlQuery =  "USE tempdb; SELECT productId, productName, productPrice, productImageURL, productImage FROM product ";
            if (req.query.id && req.query.name && req.query.price) 
                sqlQuery = sqlQuery + "WHERE productId LIKE @prodId";
            prep.input('prodId', sql.Int)
            prep.prepare(sqlQuery, err => {
                console.dir(err)
                prep.execute({prodId: req.query.id}, (err, results) => {
                    console.dir(err)

                    for(let i = 0; i <results.recordset.length; i++) {
                        let searchRes = results.recordset[i];
                        let pId = searchRes.productId;
                        let prName = searchRes.productName;
                        let prPrice = searchRes.productPrice;
                        let prIMG_URL = searchRes.productImageURL;
                        let prIMG_BIN = searchRes.productImage
                        let color =  '#943131';
                        
                     res.write('<h1>' +'</font></h2><h2><font face="Helvetica" color="'+color+'">' + prName +'</a></font>' + '</font></h1>'); 
                    
                     res.write('</font><h3><font face="Helvetica">' + "Id:  " +pId + '</font></h3>');
                    
                     res.write('</font><h3><font face="Helvetica">' + "Price: $" + prPrice  + '</font></h3>');   
                    // DONE: If there is a productImageURL, display using IMG tag
                        if (prIMG_URL != null) 
                            res.write('<img src="' + prIMG_URL + '"alt="'+ prName +'"></img>');
                    // TODO: Retrieve any image stored directly in database. Note: Call displayImage.jsp with product id as parameter.
                        if (prIMG_BIN != null) {
                            res.write('<img src="displayImage.js?id=' + pId + '">')
                        }
                    // DONE: Add links to Add to Cart and Continue Shopping
                    res.write('<h2><a href="addcart?id='+pId+'&name='+prName+'&price='+prPrice+'">Add to Cart</a></h2>');   
                    res.write('<h2><a href="listprod">Continue Shopping</a></h2>');

                    prep.unprepare(err => {console.dir(err)
                        res.end();
                    })

                    }
                })
                
            })   
           
// Get product name to search for
// TODO: Retrieve and display info for the product
//  res.write('<table border="1"><tr><th align="left"><font face="Helvetica">Product Id</th><th align="left"><font face="Helvetica">Product Name</th><th align="left"><font face="Helvetica">Product Price</th></tr>');
 
         
        } catch(err) {
            console.dir(err);
            res.write(err + "")
            res.end();
        }
    })();
});

module.exports = router;