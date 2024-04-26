import bodyParser from "body-parser";
import { Router } from "express";
import { Webhook } from "svix";
import { users } from "../../config/mongoCollections.js";
import { UnexpectedError } from "../../utils/errors.js";

const router = Router();
router
  .route("/")
  .post(
    bodyParser.raw({ type: "application/json" }),
    async function (req, res) {
      // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
      const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
      if (!WEBHOOK_SECRET) {
        throw new Error("You need a WEBHOOK_SECRET in your .env");
      }

      // Grab the headers and body
      const headers = req.headers;
      const payload = req.body;
      console.log("Payload: ", payload);
      console.log("Headers: ", headers);

      // Get the Svix headers for verification
      const svix_id = headers["svix-id"];
      const svix_timestamp = headers["svix-timestamp"];
      const svix_signature = headers["svix-signature"];

      // If there are missing Svix headers, error out
      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error occured -- no svix headers", {
          status: 400,
        });
      }

      // Initiate Svix
      const wh = new Webhook(WEBHOOK_SECRET);
      let evt;

      // Attempt to verify the incoming webhooks
      // If successful, the payload will be available from 'evt'
      // If the verification fails, error out and  return error code
      try {
        evt = wh.verify(JSON.stringify(payload), {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        });
      } catch (err) {
        // Console log and return error
        console.log("Webhook failed to verify. Error:", err.message);
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      // Grab the ID and TYPE of the Webhook
      const { id } = evt.data;
      const eventType = evt.type;

      // console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
      // // Console log the full payload to view
      // console.log("Webhook body:", evt.data);
      try {
        if (eventType === "user.created") {
          const userCollection = await users();
          const insertInfo = await userCollection.insertOne({
            _id: id,
            first_name: evt.data.first_name,
            last_name: evt.data.last_name,
            email: evt.data.email_addresses ? evt.data.email_addresses[0] ? evt.data.email_addresses[0].email_address : "" : "",
            phone_number: "",
            school_name: "",
            major: "",
            graduation_date: "",
            description: "",
            skills: [],
            settings: {
              dark_mode: false,
              suggest_cl: false,
              auto_download_cl: false,
            },
          });
          if (insertInfo.insertedCount === 0)
            return res.status(500).json({
              success: false,
              message: "User not added to database",
            });
          return res.status(200).json({
            success: true,
            message: "User added to database successfully",
          });
        }

        if (eventType === "user.deleted") {
          console.warn("Trying to delete user from database");
          const userCollection = await users();
          const deleteInfo = await userCollection.deleteOne({
            _id: id,
          });
          if (deleteInfo.deletedCount === 0)
            return res.status(404).json({
              success: false,
              message: "User not found in database",
            });
          return res.status(200).json({
            success: true,
            message: "User deleted from database successfully",
          });
        }
      } catch (err) {
        console.log("Error: ", err);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Webhook received",
      });
    }
  );

export default router;
