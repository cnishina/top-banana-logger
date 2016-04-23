/// <reference path = "../typings/main/ambient/jasmine/index.d.ts"/>

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

import {Logger, LogLevel, WriteTo} from '../lib/logger';

let logger = new Logger('FooBar');

function writeString() {
  logger.debug('hello debug');
  logger.info('hello info');
  logger.warn('hello warn');
  logger.error('hello error');
}

describe('the logger', () => {
  let logFile = path.resolve(os.tmpdir(), 'logger_test.log');

  beforeEach(() => {
    try { fs.unlinkSync(path.resolve(logFile)); } catch(e) { }
  });

  afterEach(function() {
    try { fs.unlinkSync(path.resolve(logFile)); } catch(e) { }
  });

  describe('log strings to file', () => {
    beforeEach(() => {
      Logger.setWrite(WriteTo.FILE, logFile);
    });

    afterEach(() => {
      Logger.setWrite(WriteTo.CONSOLE);
      Logger.logLevel = LogLevel.DEBUG;
    });

    it('should write debug, info, warn, and error to file', () => {
      Logger.logLevel = LogLevel.DEBUG;
      writeString();
      let lines = fs.readFileSync(path.resolve(logFile)).toString();
      let linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(6);
      expect(linesSplit[1]).toContain('D/FooBar');
      expect(linesSplit[2]).toContain('I/FooBar');
      expect(linesSplit[3]).toContain('W/FooBar');
      expect(linesSplit[4]).toContain('E/FooBar');
    });

    it('should write info, warn, and error to file', () => {
      Logger.logLevel = LogLevel.INFO;
      writeString();
      let lines = fs.readFileSync(path.resolve(logFile)).toString();
      let linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(5);
      expect(linesSplit[1]).toContain('I/FooBar');
      expect(linesSplit[2]).toContain('W/FooBar');
      expect(linesSplit[3]).toContain('E/FooBar');
    });

    it('should write warn and error to file', () => {
      Logger.logLevel = LogLevel.WARN;
      writeString();
      let lines = fs.readFileSync(path.resolve(logFile)).toString();
      let linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(4);
      expect(linesSplit[1]).toContain('W/FooBar');
      expect(linesSplit[2]).toContain('E/FooBar');
    });

    it('should write error to file', () => {
      Logger.logLevel = LogLevel.ERROR;
      writeString();
      let lines = fs.readFileSync(path.resolve(logFile)).toString();
      let linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('E/FooBar');
    });
  });

  describe('log json objects/array to file', () => {
    beforeEach(() => {
      Logger.setWrite(WriteTo.FILE, logFile);
    });

    afterEach(() => {
      Logger.setWrite(WriteTo.CONSOLE);
    });

    it('should write obj to file', () => {
      var obj = { foo: 'bar' };
      logger.info(obj);
      let lines = fs.readFileSync(path.resolve(logFile)).toString();
      let linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('{"foo":"bar"}');
    });

    it('should write an array to file', () => {
      let arr = [ 'foo', 'bar', 'foobar' ];
      logger.info(arr);
      let lines = fs.readFileSync(path.resolve(logFile)).toString();
      let linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('["foo","bar","foobar"]');
    });
  });

  describe('log different types', function() {
    beforeEach(function() {
      Logger.setWrite(WriteTo.FILE, logFile);
    });

    afterEach(function() {
      Logger.setWrite(WriteTo.CONSOLE);
    });

    it('should write json objects and strings', function() {
      var obj = { foo: 'bar' };
      var arr = [ 'foo', 'bar', 'foobar' ];
      var msg = 'foobar';
      logger.info(obj, arr, msg);
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('{"foo":"bar"} ["foo","bar","foobar"] foobar');
    });
  });
});
