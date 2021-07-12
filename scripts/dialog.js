// THIS IS UNUSED CODE - MAY USE IN FUTURE
export default class CanvasManagerDialog extends Dialog
{
/**
    * @param {Object} data               An object of dialog data which configures how the modal window is rendered
    * @param {Object} options            Dialog rendering options
    */
 constructor(data, options)
 {
    super(data, options);
 }

 /**
  * This is where you would add any custom listener code in your dialog.
  *
  * @param {jQuery} html - HTML content of the dialog.
  *
  * @override
  */
 activateListeners(html)
 {
    super.activateListeners(html);
 }

 /**
  * Convenience method to show dialog and return a Promise resolved when the button is clicked.
  *
  * @returns {Promise<unknown>}
  */
 static async show()
 {
    let randomName = "Some Name!";
    let template = "./modules/roll-credits/templates/dialog.html";

    let backingData = {
      name:"Test"
    };
    
    let dialogHTML = await renderTemplate(template, backingData);

    return new Promise((resolve) =>
    {
       new CanvasManagerDialog({
          'title': 'Demo Dialog',
          'content': dialogHTML, // Use Handlebars to construct the message w/ the
          'buttons': {                                               // random name generated.
             ok: {
                label: "Ok",
                callback: async () =>
                {
                   resolve(`Dialog OK clicked`);                   // Pass back a message via the promise.
                }
             },
             error: {
                label: "Throw Error",
                callback: async () =>
                {
                   throw new Error('Error to test stack trace of minified code.');
                }
             }
          },
          'default': "ok"
       }, 
       { id: `CanvasManagerDialog` }
       ).render(true);  // Take note of passing in the `id` here as `CanvasManagerDialog`
    });                                             // is used as the id in the HTML div tag for the app / dialog.
   }                          
}