const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const Parsed = require(src('parsed'));
const assert=require('assert');
const chaiAssert = require('chai').assert;
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var getInvalidKey=function() {
  return 'invalid key';
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
    chaiAssert.throws(
      () => {
        var p=kvParser.parse("age=23");
      },
      getInvalidKey()
    )
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected = new Parsed();
    expected.name='john';
    expected.age='23';
    chaiAssert.deepEqual(expected,actual);
    chaiAssert.throws(
      () => {
        var p=kvParser.parse("color=blue");
      },
      getInvalidKey()
    )
  });

  it("should throw an error when one of the keys is not valid",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("name=john color=blue age=23");
      },
      getInvalidKey()
    )
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("color   = blue");
      },
      getInvalidKey()
    )
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("color   = \"blue\"");
      },
      getInvalidKey()
    )
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("name = john color   = \"light blue\"");
      },
      getInvalidKey()
    )
  });

  it("should throw an error when no valid keys are specified",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser([]);
        kvParser.parse("name=john");
      },
      getInvalidKey()
    )
  });

  it("should throw an error when no array is passed",function(){
    chaiAssert.throws(
      () => {
        let kvParser=new StrictParser();
        kvParser.parse("name=john");
      },
      getInvalidKey()
    )
  });

});
