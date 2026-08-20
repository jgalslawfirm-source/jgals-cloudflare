export async function onRequestPost(context) {

    const body = await context.request.json();

    const response = await fetch("https://api.resend.com/emails", {

        method: "POST",

        headers: {
            "Authorization": `Bearer re_JeDAvZmQ_22iKNY2nkinQyx8AsXC4h9aR`,
            "Content-Type": "application/json"
        },

        // veritas@jgals.in // official email 
        body: JSON.stringify({

            from: "JGALS-Website <onboarding@resend.dev>",

            to: ["lbagaitkar@gmail.com"],  

            subject: "New Appointment Booking",

            html: `
                <h2>New Appointment</h2>

                <p><b>Name:</b> ${body.name}</p>

                <p><b>Phone:</b> ${body.phone}</p>

                <p><b>Practice Area:</b> ${body.practice}</p>

                <p><b>Message:</b></p>

                <p>${body.message}</p>
            `
        })

    });

    return Response.json(await response.json());
}
