"use strict";
// Programmer's Name: Cheng
// Program Name: Code library to make life easier on students writing text based programs
//               with Rhino 1.7.7.1 JavaScript engine running on Java Virtual Machine.
//               Does not work with any web browsers.
//////////////////////////////////////////////////////////////////////////

// Do NOT edit this file!
const Deno_stdout: typeof Deno.stdout = Deno.stdout;
const Deno_EOF = null;
const Deno_cwd: typeof Deno.cwd = Deno.cwd;
const Deno_openSync: typeof Deno.openSync = Deno.openSync;
declare type Deno_File = Deno.File;
const Deno_createSync: typeof Deno.createSync = Deno.createSync;

import * as bufio from "./deno_std/io/bufio.ts";

export const load = (noop: string)=>{};
const _textEncoder = new TextEncoder();
const _stdout_file = new Deno.File(Deno_stdout.rid);

export const print = (str?: string|number|boolean, ...rest:(string|number|boolean)[]):void=>{ // prints trailing newline
    filePrintTrailer(_stdout_file, "\n", (str == null ? "" : "" + str), ...rest);
};

export const pr = (str?: string|number|boolean, ...rest:(string|number|boolean)[]):void=>{ // prints no trailing newline
    filePrintTrailer(_stdout_file, "", (str == null ? "" : "" + str), ...rest);
};

const _stdinBuf = new bufio.BufReaderSync(Deno.stdin);
export const getInput = (): string => {
  const aLine: string|null = _stdinBuf.readString("\n");
  if (aLine == Deno_EOF) {
    return "";
  }
  return aLine.substring(0,aLine.length-1);
};
/*var getInput = (function(){
    var stdin = new java.io.BufferedReader(new java.io.InputStreamReader(java.lang.System['in']));
    return function(){return stdin.readLine();};
})();*/

// var javaSleep = function(timeMilisec){java.lang.Thread.sleep(timeMilisec);}
export const javaSleep = (ms: number) => {
  const startTime = Date.now();
  while (true) {
    if (Date.now() - startTime > ms) break;
  }
};
export const threadSleep = javaSleep;

export const currentDate = () => {
  return Date.now();
};

// File reading TODO
// var getWorkingDirectory = function(){return java.lang.System.getProperty("user.dir");}
export const getWorkingDirectory = Deno_cwd;

// var newFileReader = function(fileName){return new java.util.Scanner(new java.io.File(fileName));} // use hasNext() and nextLine() on result
export class JStyleIter<T> implements Iterator<T> {
  it: Iterator<T>;
  value: T;
  done: boolean;
  constructor(it: Iterator<T>) {
    this.it = it;
    const res = this.it.next();
    this.value = res.value;
    this.done = !!res.done;
  }
  next(): IteratorResult<T> {
    return { value: this.value, done: this.done };
  }
  nextLine(): T | null {
    const currVal = this.value;
    const currDone = this.done;

    if (!currDone) {
      const res = this.it.next();
      this.value = res.value;
      this.done = !!res.done;
    }

    if (currDone) {
      return null;
    } else {
      return currVal;
    }
  }
  hasNext(): boolean {
    return !this.done;
  }
}

export const newFileReader = (fileName: string): JStyleIter<string> => {
  return new JStyleIter(
    bufio.readLinesSync(Deno_openSync(fileName, { read: true, write: true }))
  );
};

// var fileHasInput = function(openedFileReader){return openedFileReader.hasNext();}
export const fileHasInput = (openedFileReader: JStyleIter<string>) => {
  return openedFileReader.hasNext();
};

// var fileGetInput = function(openedFileReader){return openedFileReader.nextLine();}
export const fileGetInput = (openedFileReader: JStyleIter<string>) => {
  return openedFileReader.nextLine();
};

// File writing TODO
// var newFileWriter = function(fileName){return new java.io.FileWriter(fileName);}
export const newFileWriter = (fileName: string): Deno_File => {
  return Deno_createSync(fileName);
};

// var newFileAppender = function(fileName){return new java.io.FileWriter(fileName, true);}
export const newFileAppender = (fileName: string): Deno_File => {
  return Deno_openSync(fileName, { write: true, append: true, create: true });
};

export const filePrint = (
  openedFileWriterAppender: Deno_File,
  str: string,
  ...rest:string[]
) => {
    filePrintTrailer(openedFileWriterAppender, "\n", str, ...rest);
};
/*
var filePrint = function(openedFileWriterAppender, str){
    if (!str){
        str = "";
    }
    var outStr = "" + str;
    for (var i = 2; i < arguments.length; ++i){
        outStr += " " + arguments[i];
    }
    openedFileWriterAppender.write(outStr + "\n");
}
*/

export const filePr = (
    openedFileWriterAppender: Deno_File,
    str: string,
    ...rest:string[]
  ) => {
      filePrintTrailer(openedFileWriterAppender, "", str, ...rest);
  };
/*
var filePr = function(openedFileWriterAppender, str){
    if (!str){
        str = "";
    }
    var outStr = "" + str;
    for (var i = 2; i < arguments.length; ++i){
        outStr += " " + arguments[i];
    }
    openedFileWriterAppender.write(outStr);
}
*/

export const filePrintTrailer = (
    openedFileWriterAppender: Deno_File,
    trailer: string,
    str: any,
    ...rest:any[]
  ) => {
    if (!str) {
      str = "";
    }
    var outStr = "" + str;
        for (let i = 0; i < rest.length; ++i){
          outStr += " " + rest[i];
      }
    openedFileWriterAppender.writeSync(_textEncoder.encode(outStr + trailer));
  };


// var fileClose = function(openedFileWriterAppender){openedFileWriterAppender.close();}
export const fileClose = (openedFileWriterAppender: Deno_File): void => {
  openedFileWriterAppender.close();
};

export var throwError = function(msg: string) {
  if (!msg) {
    msg = "";
  }
  msg = "" + msg;
  if (msg !== "") {
    msg += " ";
  }

  /*try{ // hack to try make Rhino give us a JavaScript stack trace
        throw new org.mozilla.javascript.WrappedException(new java.lang.RuntimeException("JavaScript stack trace only available if Rhino is running in interpreter mode, i.e. with command line arguments: -opt -1"));
    }catch(e){
        var st = "" + e.getScriptStackTrace();
        if (st === ""){
            msg += ("Error in myprogram.js line:unknown. Try ensure Rhino is in interpreter mode.");
        } else {
            var myprogramLineNumRegEx = /(myprogram\.js:)(\d+)/g;
            var matches = myprogramLineNumRegEx.exec(st);
            if (matches && matches.length > 0){
                var match = matches[0].replace(myprogramLineNumRegEx, "$2");
                st = ("Error in myprogram.js line:" + match + "\n");// + st;
            } else {
                st = "Error " + st;
            }
            msg += (st);
            
            //print(e.getLineNumber());
            //print(new java.io.File(e.getSourceName()).getName());
        }
    }*/

  throw new Error("\njs: " + msg);
};

// COLORS! see: https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
// Use by printing out the ANSI, or color216 codes.
export const ANSI_RESET = "\u001B[0m";
export const ANSI_BLACK = "\u001B[30m";
export const ANSI_RED = "\u001B[31m";
export const ANSI_GREEN = "\u001B[32m";
export const ANSI_YELLOW = "\u001B[33m";
export const ANSI_BLUE = "\u001B[34m";
export const ANSI_PURPLE = "\u001B[35m";
export const ANSI_CYAN = "\u001B[36m";
export const ANSI_WHITE = "\u001B[37m";

export const color216code = function(r: number, g: number, b: number) { // r,g,b ranges from 0 to 5
  if (r < 0) {
    r = 0;
  }
  if (g < 0) {
    g = 0;
  }
  if (b < 0) {
    b = 0;
  }
  if (r > 5) {
    r = 5;
  }
  if (g > 5) {
    g = 5;
  }
  if (b > 5) {
    b = 5;
  }
  return "\u001B[38;5;" + (16 + 36 * r + 6 * g + b) + "m";
};

export const bgcolor216code = function(r: number, g: number, b: number) { // r,g,b ranges from 0 to 5
  if (r < 0) {
    r = 0;
  }
  if (g < 0) {
    g = 0;
  }
  if (b < 0) {
    b = 0;
  }
  if (r > 5) {
    r = 5;
  }
  if (g > 5) {
    g = 5;
  }
  if (b > 5) {
    b = 5;
  }
  return "\u001B[48;5;" + (16 + 36 * r + 6 * g + b) + "m";
};

// Example usage:
// print(ANSI_RED + "Hi\n" + ANSI_GREEN + "What's your" + ANSI_BLUE + " name?");
// print(ANSI_RESET);
// print(bgcolor216code(5,5,5) + color216code(5, 0, 0) + "RED");
// print(ANSI_RESET);
