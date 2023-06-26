const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http").Server(app);
const PORT = 4000;
const dotenv = require("dotenv");
const { Suprsend } = require("@suprsend/node-sdk");
const { Event } = require("@suprsend/node-sdk");
dotenv.config();

const supr_client = new Suprsend(
  process.env.WORKSPACE_KEY,
  process.env.WORKSPACE_SECRET
);

const corsOptions = {
  origin: '*',
  credentials: true,
  
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const masterUser = {
  username: "Admin",
  email: "200104019@hbtu.ac.in",
  phone: "+919651295599",
};

const user0 = {
  username: "Ayush",
  email: "ayush0110@yahoo.in",
  phone: "+919651295599",
};
const user1 = {
  username: "Arun",
  email: "aaa@yahoo.com",
  phone: "+919651295599",
};
const user2 = {
  username: "Aryan",
  email: "bbb@gmail.com",
  phone: "+919651295599",
};

app.post("/like", async (req, res) => {
  try {
  const { username, email, phone, postnum } = req.body;
  let receiver;
  if (postnum === 0) receiver = user0;
  else if (postnum === 1) receiver = user1;
  else receiver = user2;
  const sendUser = {
    username: username,
    email: email,
    phone: phone,
  };
  const masteruser = supr_client.user.get_instance(masterUser.email);
  const receiveuser = supr_client.user.get_instance(receiver.email);
  const senduser = supr_client.user.get_instance(sendUser.email);

  const event_name = "SEND_NOTIF";

  let users = [masteruser, receiveuser, senduser];
  for (let user of users) {
    const properties = {
      "rec_name": user.username,
      "interactant_name": user.username,
      "verb": "undef",
    };
    let distinct_id;
    if (user === masteruser) {
      user.add_email(masterUser.email);
      user.add_sms(masterUser.phone);
      distinct_id=masterUser.email;
      properties.rec_name = masterUser.username;
      properties.interactant_name = sendUser.username;
      properties.verb = `${receiver.username}'s`;
    } else if (user === receiveuser) {
      user.add_email(receiver.email);
      user.add_sms(receiver.phone);
      distinct_id=receiver.email
      properties.rec_name = receiver.username;
      properties.interactant_name = sendUser.username;
      properties.verb = "your";
    } else {
      user.add_email(sendUser.email);
      user.add_sms(sendUser.phone);
      distinct_id=sendUser.email
      properties.rec_name = sendUser.username;
      properties.interactant_name = "You";
      properties.verb = `${receiver.username}'s`;
    }

    const response1 =  user.save();
    response1.then((res) => console.log("response", res));

    const event = new Event(distinct_id, event_name, properties);
    const response =  supr_client.track_event(event);
    response.then((res) => console.log("response send", res));

    
  }
  res.status(200).send({ message: 'Notification sent successfully' });
} catch (error) {
  console.error('Error sending notification:', error);
  res.status(500).send({ message: 'Error sending notification' });
}
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
