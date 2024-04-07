export default {
	async fetch(request, env, ctx) {
		const message = `:utc: *ut.code(); へようこそ！* :tada:

ut.code(); は学習・交流・開発の3つの柱で活動しています。

まず講習会などで基本的なことを学び、その後にプロジェクトに参加して実践的な開発をするという流れになっています。また、不定期で各種イベントも開催しています。

講習会や各種イベントについては、<#CJVUZ7GLU> チャンネルで随時お知らせしていますので、こちらをチェックしてください。

詳しくは <https://utcode.net/join/|こちら> をご覧ください！
`;

		if (request.method === 'POST') {
			const requestBody = await request.json();

			// URL検証チャレンジに応答
			if (requestBody.type === 'url_verification') {
				return new Response(requestBody.challenge);
			}

			// team_joinイベントに対する処理
			if (requestBody.event && requestBody.event.type === 'team_join') {
				const postMessageResponse = await sendSlackMessage(requestBody.event.user.id, message);
				return new Response(JSON.stringify(postMessageResponse), { status: 200 });
			}

			return new Response('Event received');
		}

		return new Response('Not Found', { status: 404 });

		async function sendSlackMessage(channel, message) {
			const url = 'https://slack.com/api/chat.postMessage';
			const headers = new Headers({
				'Content-Type': 'application/json',
				Authorization: `Bearer ${env.SLACK_BOT_TOKEN}`,
			});
			const body = JSON.stringify({
				channel: channel,
				text: message,
				mrkdwn: true,
			});

			const response = await fetch(url, {
				method: 'POST',
				headers: headers,
				body: body,
			});

			const responseData = await response.json();
			return responseData;
		}
	},
};
