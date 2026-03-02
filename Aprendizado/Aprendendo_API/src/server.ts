import {app} from "./app";

const PORT = Bun.env.PORT
const HOST = Bun.env.HOST

if(!PORT && !HOST){
	process.exit(1);
} else {
	app.listen({
		hostname:HOST,
		port:PORT
	})
	console.log(`server is running on http://${HOST}:${PORT}`);
}