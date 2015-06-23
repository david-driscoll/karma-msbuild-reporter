var chai = require('chai');
var should = require('chai').should();
var sinon = require("sinon");
var sinonaChai = require("sinon-chai");
var MSBuildReporter = require('../index')['reporter:msbuild'][1];

chai.use(sinonaChai);

describe('MSBuildReporter reporter', function() {
  var reporter;
  var mosaic = {
    id: 'id',
    name: 'Mosaic'
  };

  beforeEach(function(done) {
    reporter = new MSBuildReporter(function(instance) {
      instance.write = sinon.spy();
    });
    done();
  });

  it('should not produce messages without browsers', function(done) {
    reporter.onRunStart([]);
    reporter.onRunComplete([]);
    reporter.write.should.not.been.called;
    done();
  });

  it('should produce messages without tests', function(done) {
    reporter.onRunStart([mosaic]);
    reporter.onRunComplete([]);
    reporter.write.should.have.been.calledWith('blockOpened name=\'Mosaic\'\n');
    reporter.write.should.have.been.calledWith('blockClosed name=\'Mosaic\'\n');
    done();
  });

  it('should produce messages with one test', function(done) {
    reporter.onRunStart([mosaic]);
    reporter.specSuccess(mosaic, {
      description: 'SampleTest',
      time: 2,
      suite: ['Suite 1']
    });
    reporter.onRunComplete([]);
    reporter.write.should.have.been.calledWith("blockOpened name='Mosaic'\n");
    reporter.write.should.have.been.calledWith("blockClosed name='Mosaic'\n");
    reporter.write.should.have.been.calledWith(["testSuiteStarted name='Suite 1.Mosaic'",
      "testStarted name='SampleTest'",
      "testFinished name='SampleTest' duration='2'",
      "testSuiteFinished name='Suite 1.Mosaic'", ''
    ].join('\n'));

    done();
  });

});