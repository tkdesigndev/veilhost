const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const redirectTo = (request, path) => {
	const url = new URL(path, request.url);
	return Response.redirect(url.toString(), 303);
};

export async function onRequestPost({ request, env }) {
	const db = env.SUBSCRIBERS_DB ?? env.subscribers_db;

	if (!db) {
		return new Response("Subscription database is not configured.", {
			status: 500,
		});
	}

	const formData = await request.formData();
	const honeypot = String(formData.get("website") ?? "").trim();

	if (honeypot) {
		return redirectTo(request, "/subscribed/");
	}

	const email = String(formData.get("email") ?? "")
		.trim()
		.toLowerCase();

	if (!EMAIL_PATTERN.test(email)) {
		return new Response("Please enter a valid email address.", {
			status: 400,
		});
	}

	try {
		await db
			.prepare(
				`INSERT INTO subscribers (email, source)
				 VALUES (?1, ?2)
				 ON CONFLICT(email) DO UPDATE SET updated_at = CURRENT_TIMESTAMP`,
			)
			.bind(email, "homepage")
			.run();

		return redirectTo(request, "/subscribed/");
	} catch (error) {
		console.error("Subscribe form failed", error);

		return new Response("Sorry, something went wrong. Please try again later.", {
			status: 500,
		});
	}
}

export function onRequest() {
	return new Response("Method not allowed", {
		status: 405,
		headers: {
			Allow: "POST",
		},
	});
}
