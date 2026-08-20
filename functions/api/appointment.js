export async function onRequestPost(context) {

    const body = await context.request.json();

    const response = await fetch("https://api.resend.com/emails", {

        method: "POST",

        headers: {
            "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },

        // veritas@jgals.in // official email 
        body: JSON.stringify({

            from: "JGALS-Website <onboarding@resend.dev>",

            to: ["veritas@jgals.in"],  

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
