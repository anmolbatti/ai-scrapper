const Scrapes = require("../models/scrapes");
const { getBodyContent } = require('../browser.js');
const cheerio = require('cheerio');
const openai = require("../utils/openai");
const fs = require('fs');

function formatUrl(url) {
  try {
    // Check if the URL has a protocol
    const validUrl = new URL(url);
    return validUrl.href; // If it's valid, return as is
  } catch (e) {
    // If the URL is invalid, add `https://` as the default protocol
    return `https://${url}`;
  }
}

// Keywords to exclude from processing
const excludeKeywords = [
  'navigation-menu-dropdown-item',
  'navigation',
  'menu',
  'menu-dropdown',
  'menu-item',
  'submenu',
  // 'header',
  'nav-bar',
  'navItem',
  'nav-item',
  'nav_item',
  'nav__item',
  'subnav',
  'SubNav',
  'PageNav',
  // 'footer',
  'site-footer',
  'site-header',
  'application/ld+json',
  'filter',
  // 'search'
];

const removeAllWhiteSpace = (str) => {
  return str.split(/\s+/).filter(Boolean).join(' ');
}

const excludeRegex = new RegExp(excludeKeywords.join("|"), "i");

const scrapeUrl = async (req, res) => {
  var { url, fieldsToScrape } = req.body;
  const user = req.user;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  url = formatUrl(url);

  // console.log("url: ", url);

  try {
    const response = await getBodyContent(url);
    if(response.body == ""){
      return res.status(500).json({ status: false, message: "Data not found" });
    }

    const $ = cheerio.load(response.body);

    // Remove all <script> tags from the HTML
    $('script').remove();
    $('style').remove();
    $('header').remove();
    $('footer').remove();

    fs.writeFile('results.txt', response.body, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('File created and text inserted successfully!');
      }
    });

    $('*').each((_, el) => {
      const element = $(el);
    
      // Check if any attribute value matches the exclusion criteria
      const shouldExclude = Object.values(element[0].attribs || {}).some(attrValue =>
        excludeRegex.test(attrValue)
      );
    
      if (shouldExclude) {
        // console.log("exluded element: ", element.attr("class"));
        element.remove(); // Remove the entire element and its children
      }
    });

    let innerDivsText = "";

    // Function to check if any attribute contains excluded keywords
    function shouldExclude(node) {
      if (!node || !node[0]) return false;

      // Check if any attribute contains an excluded keyword
      for (const attr in node[0].attribs) {
        if (excludeRegex.test(node[0].attribs[attr])) {
          return true;
        }
      }

      // Check recursively for any child nodes
      let excludeChildren = false;
      node.children().each((_, child) => {
        if (shouldExclude($(child))) {
          excludeChildren = true;
          return false;  // Break loop if excluded keyword found in any child
        }
      });
      return excludeChildren;
    }

    $('div, section, a').each((_, el) => {
      const mainNode = $(el);
      var fieldData = {
        link: false,
        span: false
      };

      var fieldsArray = [];

      // Skip processing if any attribute contains excluded keywords
      if (shouldExclude(mainNode)){
        // console.log("element excluded: ", mainNode.attr('class'));
        return;
      } 

      if (/^h[1-6]$/.test(el.tagName)) {
        const headingText = removeAllWhiteSpace(mainNode.text().trim());
        if (headingText != "") {
          const level = "*".repeat(parseInt(content.tagName[1], 10));
          innerDivsText += `${level} => ${headingText} <= ${level}\n`;
        }
      }

      // if (el.tagName === 'a') {
      //   const linkUrl = mainNode.attr('href');
      //   // console.log("linkUrl: ", linkUrl);
        
      //   if (linkUrl) {
      //     const linkText = removeAllWhiteSpace(mainNode.text().trim());
      //     // console.log("linkText: ", linkText);
      //     if (linkText != "") {
      //         innerDivsText += `*   [${linkText}] (${linkUrl})\n\n`;
      //     }
      //   }

        
      // }

      mainNode.contents().each((index, content) => {
        const node = $(content);

        // Skip anchor tags containing excluded keywords in any attribute
        // if (content.tagName === 'a' && shouldExclude(node)) return;
        if (shouldExclude(mainNode)) return;

        if (content.tagName === 'a') {
          const linkUrl = node.attr('href');
          // console.log("linkUrl: ", linkUrl);
          
          if (linkUrl) {
            const linkText = removeAllWhiteSpace(node.text().trim());
            // console.log("linkText: ", linkText);
            if (linkText) {
                innerDivsText += `*   [${linkText}] (${linkUrl})\n\n`;
                fieldData.link = true;
                fieldsArray.push("link");
            }else{
                innerDivsText += `*   [Achor tag with no text] (${linkUrl})\n\n`;
                fieldData.link = true;
                fieldsArray.push("link");
            }
          }

        } else if (content.type === "text") {
          const text = removeAllWhiteSpace(node.text().trim());
          if (text != "") {
            if (el.tagName === 'div') {
              innerDivsText += `\n`;
            }
            innerDivsText += `(${text})\n`;

          }

        } else if (/^h[1-6]$/.test(content.tagName)) {
          const headingText = removeAllWhiteSpace(node.text().trim());
          if (headingText) {
            const level = "*".repeat(parseInt(content.tagName[1], 10));
            innerDivsText += `${level} => ${headingText} <= ${level}\n`;
          }
        } else if (content.tagName === 'p') {
          const paragraphText = removeAllWhiteSpace(node.text().trim());
          if (paragraphText != "") {
            innerDivsText += `(${paragraphText})\n`;
          }
        } else if (content.tagName === 'span') {
          const spanSelfText = removeAllWhiteSpace(node.text().trim());
          if (spanSelfText != "") {
            fieldData.span = true;
            fieldsArray.push("span");
            innerDivsText += `(${spanSelfText})\n`;
          }

        //   let spanText = "";
        //   // spanText = `Class = ${node.attr('class')} `;
        //   // if (/price/i.test(node.attr('class') || "")) {
        //     // Recursive function to get all text from child nodes
        //     function collectText(node) {
        //       node.contents().each((_, child) => {
        //         const childNode = $(child);
        //           // spanText += `Class = ${childNode.attr('class')} `;
            
        //         // Add the text content of the current node
        //           const childText = removeAllWhiteSpace(childNode.text().trim());
        //           if (childText) {
        //             spanText += `Text = ${childText}`;
        //           }
                  
        //           // Recursively collect text from child elements
        //           if (childNode.contents().length > 0) {
        //             collectText(childNode);
        //           }
        //         });
        //       }
              
        //       collectText(node);
              
        //       if (spanText !== "") {
        //         innerDivsText += `(${spanText})\n`;
        //       }
        //   // }
        // }
        // else{
        //   const text = node.text().trim();
        //   if (text) {
        //     innerDivsText += `(${text})\n`;
        //   }
        }
        else if (content.tagName === 'ul') {
          let listText = "";
          node.find('li').each((li_id, li) => {
            const listItemNode = $(li);
            if (shouldExclude(listItemNode)) return;

            const listItemText = removeAllWhiteSpace(listItemNode.text().trim());
            if (listItemText != "") {
              listText += ` • (${listItemText})\n`;
            }
          });
          if (listText) {
            innerDivsText += "[ \n" + listText + "] \n";
          }
        }

        if(fieldsArray[0] === "link" && fieldsArray[1] === "span"){
          innerDivsText += "\n============================\n";  
        }
        
        
      });

      if(fieldsArray[0] === "link" && fieldsArray[1] === "span"){
        innerDivsText += "\n============================\n";  
      }
      
      // if(fieldData.link === true && fieldData.span === true){
      //   innerDivsText += "\n============================\n";
      // }

      // innerDivsText += '\n';
    });

    // return res.status(200).send(innerDivsText);
    // console.log("writing the file");

    // fs.writeFile('results.txt', innerDivsText, (err) => {
    //         if (err) {
    //           console.error('Error writing file:', err);
    //         } else {
    //           console.log('File created and text inserted successfully!');
    //         }
    //       });

          // res.status(200).json({ status: true, content: [{hello: "test"}] });

    try {
      const chatRes = await openai(innerDivsText, fieldsToScrape);
      // console.log("chatRes: ", chatRes);
      if(chatRes){
          const scrape = await new Scrapes({
            url: url,
            bodyContent: JSON.stringify(chatRes),
            fields: fieldsToScrape,
            userId: user?.id || 1
          }).save();
          
          if (scrape) {
            res.status(200).json({ status: true, content: chatRes });
          } else {
            res.status(500).json({ status: false, message: "Something went wrong", error: scrape });
          }
        }else{
          res.status(500).json({ status: false, message: "Error while getting data from chatgpt", error: "Error while getting data from chatgpt" });    
        }
      } catch (error) {
      // console.error("error: ", error);
      res.status(500).json({ status: false, message: error?.message ? error?.message : "Limit exceeded please try again later...", error: error });
    }
      
    
  } catch (err) {
    console.log("Error fetching content:", err);
    res.status(500).json({ success: false, message: "Error fetching content" });
  }
};


const getScrapedData = async (req, res) => {
    var {page, limit} = req.query;
    const user = req.user;

    try {
      if(!page){
        page = 1;
      }

      if(!limit){
        limit = 20;
      }

      const skip = (page - 1) * limit;

      const total = (await Scrapes.find({userId: user.id})).length;
      const scrapes = await Scrapes.find({userId: user.id})
          .sort({createdAt: -1})
          .skip(skip)
          .limit(limit)
          .exec();

      res.status(200).json({ success: true, data: scrapes, total });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
}

const getScrapedDataById = async (req, res) => {
  var id = req.params.id;
  
  try {
    if(!id) {
      return res.status(404).json({ success: false, message: "Id is required!" });  
    }

    const scrapes = await Scrapes.findOne({"_id": id});
    if(!scrapes){
      return res.status(404).json({ success: false, message: "Scrape not found!" });  
    }

    res.status(200).json({ success: true, data: scrapes });
  } catch (err) {
    res.status(500).json({ success: false, data: err.message });
  }
}

module.exports = { scrapeUrl, getScrapedData, getScrapedDataById };
