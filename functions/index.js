const Functions = require('firebase-functions')
const Admin = require('firebase-admin')
const SendGrid = require('@sendgrid/mail')

Admin.initializeApp(Functions.config().firebase)

SendGrid.setApiKey(Functions.config().sendgrid.key)

exports.sendMessage = Functions.https.onCall((data, context) => {
  const uid = context.auth.uid || null
  Admin
    .database()
    .ref('/users/' + uid)
    .once('value')
    .then(snapshot => {
      const {details: message, subject } = data
      const { email, name, phone, street } = snapshot.val()
      const emailConfig = {
        to: 'sosa.glean.tn@gmail.com',
        from: 'sosa.glean.tn@gmail.com',
        subject,
        templateId: 'd-b1f6d9ac6715453d9c7ba5b3edfbe6a2',
        dynamic_template_data: {
          name,
          message,
          phone,
          address: street,
          email
        }
      }
      SendGrid.send(emailConfig)
    })
})
