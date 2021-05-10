import getController from "./get.controller.mjs";

export default (req, res) => {
  if (req.method === 'GET') return getController(req, res);
  res.end('This method is not allowed on the server');
};
