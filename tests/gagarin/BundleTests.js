describe('clinical:hl7-resources-bundles', function () {
  var server = meteor();
  var client = browser(server);

  it('Bundles should exist on the client', function () {
    return client.execute(function () {
      expect(Bundles).to.exist;
    });
  });

  it('Bundles should exist on the server', function () {
    return server.execute(function () {
      expect(Bundles).to.exist;
    });
  });

});
