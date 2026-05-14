export default () => ({
  type: "content-api",
  routes: [
    {
      method: "GET",
      path: "/",
      // name of the controller file & the method.
      handler: "controller.index",
      config: {
        policies: [],
      },
    },
  ],
});
