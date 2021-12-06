const express = require("express");
const router = express.Router();
const sql = require("mssql");
const moment = require("moment");

router.get("/", function (req, res, next) {
  res.setHeader("Content-Type", "text/html");
  res.write("<title>Edible Textbooks Orders List</title>");
  res.write(
    '<header><nav><ul><li><a href="/"> Home </a></li><li><a href="/listprod"> Find Products </a></li><li><a href="/showcart"> Your Cart </a></li><li> <a href="/listorder"> Past orders </a></li></ul></nav></header>'
  );

  res.write(
    "<style type=text/css> header {background-color: white; position: static; left: 0; right: 0;  top: 5px;  height: 30px;  display: flex;  align-items: center;  }  header * {  display: inline;  }  header li {  margin: 20px;  }  header li a {  color: blue;  text-decoration: none;  }  </style>"
  );
  res.write(
    '<h1 align="center"><font face="normal" color="#cf0921">Tasty Texts</font></h1><hr>'
  );
  res.write(
    '<h1><font face="" color="#db2323">Enter name of product:</font></h1>'
  );

  //get categories drop down menu
  res.write('<form method ="get" action="listprod">');
  res.write('<select class="selectpicker" name = "catName">');
  res.write('<optgroup label = "Course Category">');
  res.write('<option value=""> All </option>');
  res.write("<option> BIOL </option>");
  res.write("<option> MATH </option>");
  res.write("<option> APSC </option>");
  res.write("<option> COSC </option>");
  res.write("<option> POLI </option>");
  res.write("<option> WRLD </option>");

  res.write("</optgroup>");

  //get search bar
  res.write('<form method="get" action="listprod">');
  res.write('<input type="text" name="pName" size="50">');
  res.write(
    '<input type="submit" value="Submit"><input type="reset" value="Reset">'
  );
  res.write("</form>");

  res.write("</select>");
  res.write("</form>");

  (async function () {
    try {
      let pool = await sql.connect(dbConfig);

      let results = false;
      let sqlQuery =
        "USE tempdb; SELECT productId, productName, productPrice, categoryName FROM product JOIN category ON product.categoryId=category.categoryId ";

      if (req.query.pName && req.query.catName) {
        sqlQuery =
          sqlQuery +
          "WHERE productName LIKE @productName AND categoryName LIKE @categoryName";
        results = await pool
          .request()
          .input("productName", sql.VarChar, "%" + req.query.pName + "%")
          .input("categoryName", sql.VarChar, "%" + req.query.catName + "%")
          .query(sqlQuery);
      } else if (req.query.pName) {
        sqlQuery = sqlQuery + "WHERE productName LIKE @productName";
        results = await pool
          .request()
          .input("productName", sql.VarChar, "%" + req.query.pName + "%")
          .query(sqlQuery);
      } else if (req.query.catName) {
        sqlQuery = sqlQuery + "WHERE categoryName LIKE @categoryName";
        results = await pool
          .request()
          .input("categoryName", sql.VarChar, "%" + req.query.catName + "%")
          .query(sqlQuery);
      } else {
        results = await pool.request().query(sqlQuery);
      }
      res.write(
        '<table border="1"><tr><th align="left"><font face="Helvetica">Add to Cart</th><th align="left"><font face="Helvetica">Product Id</th><th align="left"><font face="Helvetica">Product Name</th><th align="left"><font face="Helvetica">Product Price</th><th align="left"><font face="Helvetica">Category Name</th></tr>'
      );
      for (let i = 0; i < results.recordset.length; i++) {
        let searchRes = results.recordset[i];
        let pId = searchRes.productId;
        let prName = searchRes.productName;
        let prPrice = searchRes.productPrice;
        let caName = searchRes.categoryName;
        let color = "black";
        if (caName == "BIOL") color = "#943131";
        if (caName == "MATH") color = "#ad8832";
        if (caName == "APSC") color = "#63ad32";
        if (caName == "COSC") color = "#33917b";
        if (caName == "POLI") color = "#338891";
        if (caName == "WRLD") color = "#334c91";
        res.write(
          "<tr><td>" +
            '<font face="Helvetica"><a href="addcart?id=' +
            pId +
            "&name=" +
            prName +
            "&price=" +
            prPrice +
            '">Add to Cart</a></font>' +
            '</td><td><font face="Helvetica" color="' +
            color +
            '">' +
            pId +
            '</font></td><td><font face="Helvetica" color="' +
            color +
            '">' +
            '<a href="product?id=' +
            pId +
            "&name=" +
            prName +
            "&price=" +
            prPrice +
            '">' +
            prName +
            "</a></font>" +
            '</font></td><td><font face="Helvetica" color="' +
            color +
            '">' +
            "$" +
            prPrice +
            '</font></td><td><font face="Helvetica" color="' +
            color +
            '">' +
            caName +
            "</font></td></tr>"
        );
      }

      res.write("</table>");

      res.end();
    } catch (err) {
      console.dir(err);
      res.end();
    }
  })();
});

module.exports = router;

/**
    Useful code for formatting currency:
        let num = 2.87879778;
        num = num.toFixed(2); **/