import { Inngest } from "inngest";
import connectDB from "./db";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "usedgoods-next" });

export const syncUserCreation = inngest.createFunction({
    id: "sync-user-from-clerk"},
    {event: "clerk/user.created"},
    async ({event}) => {
        const{id,firstName,lastName,email_adresses,image_url} = event.data;
        const userData = {
            _id: id,
            name: firstName + " " + lastName,
            email: email_adresses[0].email_address,
            imageUrl: image_url,
        }
        await connectDB();
        await User.create( userData)
    }
)

// inngest function to updata user data in database
export const syncUserUpdation = inngest.createFunction(
    {id: "update-user-from-clerk"},
    {event: "clerk/user.updated"},
    async ({event}) => {
        const{id,firstName,lastName,email_adresses,image_url} = event.data;
        const userData = {
            _id: id,
            name: firstName + " " + lastName,
            email: email_adresses[0].email_address,
            imageUrl: image_url,
        }
        await connectDB();
        await User.findByIdAndUpdate(id, userData)
    }
)

// inngest function to delete user data in database
export const syncUserDeletion = inngest.createFunction(
    {id: "delete-user-from-clerk"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        const{id} = event.data;
        await connectDB();
        await User.findByIdAndDelete(id)
    }
)