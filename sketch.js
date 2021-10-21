var imgcount = 0;
var diff = 3;//どれぐらいずらすか

var rangedata = [];

var PixelData = [];

var img0, img1, img2, img3, img, Kotei, Jiyu, Sakujo, imgOriginal;

var count = 0;

var framerate = 10;//framerate
var speed = 4;
var fm = 5;//framerateをいい感じにする変数

var Mang;
var ang = [];//Moveangle,一つ目の画像の角度，２つ目

var Efx, Efy;//embossを行う最初のピクセル座標
var efx, efy;//embossを行う最初のピクセル座標（現在の）
var elx, ely;//embossを行う最初のピクセル数座標（現在の）

//動かす許可
var move = false;
//パート機能を使っていた場合
var part = false;
//複数のパート機能を使う場合
var MulchMode = false;



var gx, gy, nx, ny;//xy方向に何ピクセルずらすか（g:グレースケール，n：ネガポジ）

var x = -10, y = -10, ax = -10, ay = -10;//四角・円に使用する４変数

var allpart = false;//全画面選択を一度でも使ったかどうか

var mode = 0;//領域選択をrectにするかellipseにするか

var framemode = true;//frameを固定する(true)かしない(false)か

var imgx, imgy, imgEx, imgEy;  //画像の座標

var rangesize;//前フレームのrangedata.size()を保存する変数

var framemodespeed = 3;//framemode(true)で使うspeedの変数

var savepixel;

var LassoPixelX = [];
var LassoPixelY = [];
var LassoPixelXX = [];
var LassoPixelYY = [];
var Rasso = 0;//Rassoのpiselデータを繋ぐ番号

var hozon = false;//保存時にtrueになる

var po = 0;

var input;

var syorityu = false;
//元画像の大きさ
var originalWidth;
var originalheight;

let isRecording = false;
var hiquality = true;
var mp4 = false;

var Movemode = 2;


function preload() {
  //変数を使って画像をロード
  img = loadImage("bike.jpg");
  imgOriginal = loadImage("bike.jpg");
  Kotei = loadImage("Kotei.png");
  Jiyu = loadImage("Jiyu.png");
  Sakujo = loadImage("Sakujo.png");
}

function setup() {
  frameRate(framerate);
  var p5Canvas = createCanvas(1200, 800);
  canvas = p5Canvas.canvas;
  textFont("Meiryo", 50);

  Kotei.resize(105, 50);

  Jiyu.resize(105, 50);

  Sakujo.resize(70, 70);
  originalWidth = img.width;
  originalheight = img.height;
  console.log(originalWidth, originalheight, img.width, img.height);
  imageReset(img);

  savepixel = [];//Moveangle,一つ目の画像の角度，２つ目

  input = createFileInput(handleFile);
  input.position(30, 30);

}

function imageLoaded() { //

  img.resize(400, 0);

  if (img.width >= 400) {
    img.resize(400, 0);
  } else if (img.height >= 300) {
    img.resize(0, 300);
  }
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = loadImage(file.data, imageLoaded);
    originalWidth = img.width;
    soriginalheight = img.height;
    imageReset(img);
  } else {
    img = null;
  }
}
var capturer = new CCapture({
  format: 'webm',
  framerate: 10,
  verbose: true,
  name: 01,
  timeLimit: 20
});
var canvas;



function draw() {
  frameRate(framerate);
  if (hozon) {

    if (mp4 && imgcount == 0) {
      capturer.start();


    } else if (mp4 && imgcount == 92) {
      capturer.save();
      capturer.stop();
    }

    if (imgcount % 4 == 0) {
      image(img0, 0, 0);
    } else if (imgcount % 4 == 1) {
      image(img1, 0, 0);
    } else if (imgcount % 4 == 2) {
      image(img2, 0, 0);
    } else if (imgcount % 4 == 3) {
      image(img3, 0, 0);
    }

    imgcount++;

  } else {
    document.getElementById("Twitter").style.display = "none";

    background(70);
    //background(68, 114, 196);

    //GUI
    stroke(140);
    strokeWeight(1);
    fill(31, 30, 99);
    rect(10, 10, 1180, 780);//上部の四角

    fill(140);
    stroke(162, 162, 173);
    rect(200, 60, 990, 730);//画像背景
    fill(220, 213, 200);
    rect(10, 60, 190, 730);//左のメニューバ-


    stroke(140);
    textSize(20);
    fill(31, 30, 99);
    text("領域選択", 65, 95);
    fill(237, 234, 227);
    noStroke();
    rect(20, 105, 170, 170, 5);//領域選択のアイコン背景


    stroke(140);
    fill(31, 30, 99);
    text("運動方法", 65, 315);
    fill(237, 234, 227);
    noStroke();
    rect(20, 325, 170, 255, 5);//運動速度のアイコン選択

    stroke(140);
    fill(31, 30, 99);
    text("領域削除", 65, 625);
    image(Sakujo, 70, 640);

    //領域選択
    if (mode == 0) {
      fill(99, 98, 30);
      rect(40, 120, 130, 60);
    }


    if (mode == 1) {
      fill(99, 98, 30);
      rect(40, 195, 130, 60);
    }


    //運動中止
    fill(143, 170, 220);


    //運動速度
    if (Movemode == 0) {
      fill(99, 98, 30);
      rect(30, 340, 75, 60);
    } else if (Movemode == 1) {
      fill(99, 98, 30);
      rect(105, 340, 75, 60);
    } else if (Movemode == 2) {
      fill(99, 98, 30);
      rect(30, 420, 75, 60);
    } else if (Movemode == 3) {
      fill(99, 98, 30);
      rect(105, 420, 75, 60);
    } else if (Movemode == 4) {
      fill(99, 98, 30);
      rect(30, 500, 75, 60);
    }

    //メニューバーのアイコン
    fill(20);
    rect(60, 130, 90, 40);//四角アイコン
    ellipse(105, 225, 50, 50);//丸アイコン

    fill(20);

    //image(Kotei, 55, 345);
    text("移動", 50, 375);
    text("拡大", 120, 375);
    text("縮小", 50, 455);
    text("振動", 120, 455);
    text("不動", 50, 535);



    fill(255);
    text("動画出力:", 920, 45);

    fill(111, 98, 178);
    rect(1013, 15, 60, 40, 5);

    fill(255);
    text("GIF", 1025, 45);

    fill(111, 98, 178);
    rect(1090, 15, 80, 40, 5);

    fill(255);
    text("WebM", 1100, 45);


    //image(img, imgx, imgy);


    if (rangedata.length > 0) {
      //framemode(true)で全ての領域の画像の動きを合わせる

      //frame合わせ
      //frameRate(rangedata.get(a).speed*20);
      if (imgcount % 4 == 0) {
        image(img0, imgx, imgy);
      } else if (imgcount % 4 == 1) {
        image(img1, imgx, imgy);
      } else if (imgcount % 4 == 2) {
        image(img2, imgx, imgy);
      } else if (imgcount % 4 == 3) {
        image(img3, imgx, imgy);
      }
      if (imgcount < 3) {
        imgcount++;
      } else {
        imgcount = 0;
      }

    } else {
      image(img, imgx, imgy);
    }




    rangesize = rangedata.length;

    strokeWeight(3);
    stroke(255, 0, 0);
    noFill();
    if (mode == 0) {
      rect(x, y, ax, ay);

    } else if (mode == 1) {
      ellipse(x, y, ax, ay);
    } else if (mode == 2) {

    }

  }

}


function emboss(num, wi, he) {
  img.loadPixels();
  imgOriginal.loadPixels();
  pixel = [];
  Embpixel1 = [];
  Embpixel2 = [];
  Menu = [];

  if (wi == img.width && he == img.height) {

  } else {
    imgx = 0;
    imgy = 0;
  }

  //ピクセルを変更する範囲を求める
  for (j = 0; j < he - diff; j++) {
    for (i = 0; i < wi - diff; i++) {
      //println(i,j);
      //四角の場合
      if (rangedata[num].mode == 0) {

        if (rangedata[num].efX < i + imgx && rangedata[num].elX > i + imgx && rangedata[num].efY < j + imgy && rangedata[num].elY > j + imgy) {
          pixel.splice(i + (wi - diff) * j, 0, 1);

        } else {
          pixel.push(0);
        }
      }
      //円の場合   
      if (rangedata[num].mode == 1) {
        let aX, bX;
        if (rangedata[num].elX >= rangedata[num].elY) {
          aX = rangedata[num].elX;
          bX = rangedata[num].elY;
        } else {
          bX = rangedata[num].elX;
          aX = rangedata[num].elY;
        }

        if (sq(i + imgx - rangedata[num].efX) / sq((aX / 2)) + sq(j + imgy - rangedata[num].efY) / sq((bX / 2)) <= 1) {
          pixel.splice(i + (wi - diff) * j, 0, 1);
        } else {
          pixel.push(0);
        }
      }

    }
  }

  Menu.push(pixel);

  var centerX = 0, centerY = 0;
  if (rangedata[num].mode == 0) {
    centerX = (rangedata[num].efX + rangedata[num].elX) / 2;
    centerY = (rangedata[num].efY + rangedata[num].elY) / 2;
  } else if (rangedata[num].mode == 1) {
    centerX = rangedata[num].efX;
    centerY = rangedata[num].efY;
  }


  var gc, nc, f1, f2, f, s1, s2, s;

  //一方向
  if (rangedata[num].movemode == 0) {
    MangCalc(centerX, centerY);

    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = s1 + s2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
    //拡大
  } else if (rangedata[num].movemode == 1) {
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        MangCalc(imgx + i, imgy + j);

        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = 255 - brightness(gc);
        s1 = brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = brightness(nc);
        s2 = 255 - brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = s1 + s2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
    //縮小
  } else if (rangedata[num].movemode == 2) {
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        MangCalc(imgx + i, imgy + j);
        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = s1 + s2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);

      }
    }
  }//振動
  else if (rangedata[num].movemode == 3) {
    MangCalc(centerX, centerY);
    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (wi == img.width && he == img.height) {
          gc = img.get(i + gx, j + gy);
          nc = img.get(i + nx, j + ny);
        } else {
          gc = imgOriginal.get(i + gx, j + gy);
          nc = imgOriginal.get(i + nx, j + ny);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = f1 + f2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
    //運動なし（グレースケール）
  } else if (rangedata[num].movemode == 4) {

    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {

        if (wi == img.width && he == img.height) {
          gc = img.get(i, j);
          nc = img.get(i, j);
        } else {
          gc = imgOriginal.get(i, j);
          nc = imgOriginal.get(i, j);
        }
        //元画像の(i+diff, j+diff)のピクセルの明るさをfloat f1に入れる
        f1 = brightness(gc);
        s1 = 255 - brightness(gc);
        //元画像の(i, j)のピクセルの明るさを反転させてfloat f２に入れる
        f2 = 255 - brightness(nc);
        s2 = brightness(nc);
        //出力画像の(i, j)のピクセルの明るさを(f1+f2-128)にする
        f = f1 + f2 - 128;
        s = f1 + f2 - 128;
        //color c=img.pixels[i+nx+(j+ny)*img.width];
        Embpixel1.push(f);
        Embpixel2.push(s);
      }
    }
  }



  Menu.push(Embpixel1);
  Menu.push(Embpixel2);

  PixelData.splice(num, 1, Menu);
  console.log(PixelData);
  syorityu = false;

  function MangCalc(_centerx, _centery) {
    //クリックした位置の方向に運動させるために必要な画像の角度を求める
    Mang = degrees(atan2(rangedata[num].mousey - _centery, rangedata[num].mousex - _centerx));
    if (Mang > 180) {
      Mang = Mang - 360;
    }
    if (Mang <= 0 && Mang >= -90) {
      gx = 0;
      gy = abs(round(sin(radians(Mang)) * diff));
      nx = abs(round(cos(radians(Mang)) * diff));
      ny = 0;
    } else if (Mang <= -90 && Mang >= -180) {
      gx = abs(round(cos(radians(Mang)) * diff));
      gy = abs(round(sin(radians(Mang)) * diff));
      nx = 0;
      ny = 0;
    } else if (Mang >= 0 && Mang <= 90) {
      gx = 0;
      gy = 0;
      nx = abs(round(cos(radians(Mang)) * diff));
      ny = abs(round(sin(radians(Mang)) * diff));
    } else if (Mang >= 90 && Mang <= 180) {
      gx = abs(round(cos(radians(Mang)) * diff));
      gy = 0;
      nx = 0;
      ny = abs(round(sin(radians(Mang)) * diff));
    }
  }
}


// ドラッグ開始
function mousePressed() {
  var moveJug = false;//一度でも範囲に入ったかどうか
  var moveJugNum = -1;//入ったNoを書いておいて一番上層のNoを最後参照して動かす
  if (mouseX >= imgx && mouseX <= imgEx && mouseY >= imgy && mouseY <= imgEy) {
    if (mouseButton == LEFT) {
      var partclick = false;
      for (k = rangedata.length - 1; k >= 0; k--) {

        //既に指定された部分の動き方向を変える場合

        //四角の場合

        if (rangedata[k].mode == 0) {
          if (mouseX > rangedata[k].efX && mouseX < rangedata[k].elX && mouseY > rangedata[k].efY && mouseY < rangedata[k].elY && !(rangedata[k].efX == imgx && rangedata[k].elX == imgEx && rangedata[k].efY == imgy && rangedata[k].elY == imgEy) && moveJug == false) {
            moveJug = true;
            efx = rangedata[k].efX;
            efy = rangedata[k].efY;
            elx = rangedata[k].elX;
            ely = rangedata[k].elY;
            Speed(efx, efy, elx, ely, rangedata[k].mode);
            rangedata.splice(k, 1, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 0, 0, Movemode));
            PixelData.splice(k, 1);
            emboss(k, img.width, img.height);
            partclick = true;
          }
        } else if (rangedata[k].mode == 1) {  //円の場合 
          var a, b;
          if (rangedata[k].elX >= rangedata[k].elY) {
            a = rangedata[k].elX;
            b = rangedata[k].elY;
          } else {
            b = rangedata[k].elX;
            a = rangedata[k].elY;
          }

          if (sq(mouseX - rangedata[k].efX) / sq((a / 2)) + sq(mouseY - rangedata[k].efY) / sq((b / 2)) <= 1 && moveJug == false) {
            moveJug = true;
            efx = rangedata[k].efX;
            efy = rangedata[k].efY;
            elx = rangedata[k].elX;
            ely = rangedata[k].elY;
            Speed(efx, efy, elx, ely, rangedata[k].mode);
            rangedata.splice(k, 1, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 1, 0, Movemode));
            PixelData.splice(k, 1);

            emboss(k, img.width, img.height);
            partclick = true;
          }
        }


      }

      //全画面選択
      if (!partclick) {
        efx = imgx;
        efy = imgy;
        elx = imgEx;
        ely = imgEy;

        speed = Speed(efx, efy, elx, ely, 0);

        rangedata.splice(0, 0, new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, 0, 0, Movemode));
        console.log(rangedata);

        if (allpart && rangedata.length >= 2) {
          rangedata.splice(1, 1);
        }
        if (allpart && PixelData.length >= 1) {
          PixelData.length = 0;
        }


        allpart = true;//一度でも全画面選択が使用されたか

        for (k = 0; k < rangedata.length; k++) {
          emboss(k, img.width, img.height);

        }
      }

      framemodespeed = int(speed);
      imageGeneration(img.width, img.height);
    }


  }


  //指定ドラッグスタート座標
  if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930) {

    if (mouseButton == RIGHT) {
      Efx = mouseX;
      Efy = mouseY;

      if (mode == 0 || mode == 1) {
        x = Efx;
        y = Efy;

      }
    }
  }

  //メニューバー
  if (mouseButton == LEFT) {
    //領域選択
    if (mouseX > 40 && mouseX < 170 && mouseY > 120 && mouseY < 180) {
      mode = 0;
    } else if (mouseX > 40 && mouseX < 170 && mouseY > 195 && mouseY < 255) {
      mode = 1;
    }
    noStroke();
    if (Movemode == 0) {
      fill(99, 98, 30);
      rect(30, 340, 75, 60);
    } else if (Movemode == 1) {
      fill(99, 98, 30);
      rect(105, 340, 75, 60);
    } else if (Movemode == 2) {
      fill(99, 98, 30);
      rect(30, 420, 75, 60);
    } else if (Movemode == 3) {
      fill(99, 98, 30);
      rect(105, 420, 75, 60);
    }

    //運動方法
    if (mouseX > 30 && mouseX < 105 && mouseY > 340 && mouseY < 400) {
      Movemode = 0;
    } else if (mouseX > 105 && mouseX < 180 && mouseY > 340 && mouseY < 400) {
      Movemode = 1;
    } else if (mouseX > 30 && mouseX < 105 && mouseY > 420 && mouseY < 480) {
      Movemode = 2;
    } else if (mouseX > 105 && mouseX < 180 && mouseY > 420 && mouseY < 480) {
      Movemode = 3;
    } else if (mouseX > 30 && mouseX < 105 && mouseY > 500 && mouseY < 560) {
      Movemode = 4;
    }


    //領域削除
    if (mouseX > 70 && mouseX < 140 && mouseY > 640 && mouseY < 710) {
      for (i = 0; i < rangedata.length; i++) {
        if (efx == rangedata[i].efX) {
          if (rangedata[i].efX == imgx && rangedata[i].elX == imgEx && rangedata[i].efY == imgy && rangedata[i].elY == imgEy) {
            allpart = false;
          }
          rangedata.splice(i, 1);
        }
      }

      for (k = 0; k < rangedata.length; k++) {
        emboss(k, img.width, img.height);
      }
      imageGeneration(img.width, img.height);

    }

    //動画出力
    //GIF　rect(1013, 15, 60, 40, 5);  

    if (mouseX > 1013 && mouseX < 1073 && mouseY > 0 && mouseY < 60 && po == 0) {
      Export();
      createLoop({ duration: 4, gif: { download: true } });
    }

    //WEBM rect(1090, 15, 80, 40, 5);
    if (mouseX > 1090 && mouseX < 1170 && mouseY > 0 && mouseY < 60 && po == 0) {
      Export();
      mp4 = true;
    }
  }
}

function Export() {
  document.getElementById("Twitter").style.display = "block";
  var sketch1 = function (p) {
    p.setup = function () {
      p.createCanvas(1200, 800);
    };

    p.draw = function () {
      p.fill(255);
      p.textSize(50);
      p.background(31, 30, 99);
      p.text("出力中", 520, 400);

    };
  };
  new p5(sketch1, "container1");

  hozon = true;
  p5Canvas = createCanvas(originalWidth, originalheight);
  p5Canvas.hide();

  img0 = createImage(originalWidth, originalheight);
  img1 = createImage(originalWidth, originalheight);
  img2 = createImage(originalWidth, originalheight);
  img3 = createImage(originalWidth, originalheight);

  //rangedataを元の画像サイズ版にする
  for (i = 0; i < rangedata.length; i++) {
    console.log(rangedata[i].efX, rangedata[i].efY, rangedata[i].elX, rangedata[i].elY);
    rangedata[i].efX = map(rangedata[i].efX, imgx, imgEx, 0, originalWidth);
    rangedata[i].efY = map(rangedata[i].efY, imgy, imgEy, 0, originalheight);
    rangedata[i].elX = map(rangedata[i].elX, imgx, imgEx, 0, originalWidth);
    rangedata[i].elY = map(rangedata[i].elY, imgy, imgEy, 0, originalheight);
    console.log(rangedata[i].efX, rangedata[i].efY, rangedata[i].elX, rangedata[i].elY);
    emboss(i, originalWidth, originalheight);
  }

  imageGeneration(originalWidth, originalheight);


  //createLoop({duration:3, gif:{download:true}});
  save(img0, "1.png");
  save(img1, "2.png");
  save(img2, "3.png");
  save(img3, "4.png");
  imgcount = 0;

}


// ドラッグ中にマウスの場所が四角の終点になる
function mouseDragged() {
  if (mouseButton == RIGHT) {
    if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930) {

      if (mode == 0) {
        ax = mouseX - x;
        ay = mouseY - y;
      } else if (mode == 1) {
        ax = (mouseX - x) * 2;
        ay = (mouseY - y) * 2;
        if ((keyPressed == true) && (keyCode == CONTROL)) {
          var a = dist(x, y, mouseX, mouseY);
          ax = int(a * 2);
          ay = int(a * 2);
        }
      }
    }
  }
}

// ドラッグ終了時に四角が消えて指定した部分が動く
function mouseReleased() {
  if (mouseButton == RIGHT) {
    if (mouseX >= 200 && mouseX <= 1190 && mouseY >= 60 && mouseY <= 930) {
      efx = Efx;
      efy = Efy;

      //選択範囲がウィンドウを越えた場合
      if (mode == 0) {
        if (mouseX >= imgEx) {
          elx = imgEx;
        } else {
          elx = mouseX;
        }
        if (mouseY >= imgEy) {
          ely = imgEy;
        } else {
          ely = mouseY;
        }
        //逆位置からドラックした場合
        if (efx >= elx) {
          var a = elx;
          elx = efx;
          efx = a;
        }
        if (efy >= ely) {
          var a = ely;
          ely = efy;
          efy = a;
        }
      } else if (mode == 1) {
        elx = ax;
        ely = ay;
      }

      //mode2と被っているので一時的なコードにしてる
      if (mode != 2) {
        speed = 3;

        rangedata.push(new RangeData(efx, efy, elx, ely, mouseX, mouseY, speed, mode, 0, Movemode));

        emboss(rangedata.length - 1, img.width, img.height);

        x = -10;
        y = -10;
        ax = -10;
        ay = -10;
      }

    }
    imageGeneration(img.width, img.height);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    framerate = framerate + 5;
  } else if (framerate > 5 && keyCode === DOWN_ARROW) {
    framerate = framerate - 5;
  }
  console.log(framerate);
}

function imageGeneration(wi, he) {
  syorityu = true;
  img0.loadPixels();
  img1.loadPixels();
  img2.loadPixels();
  img3.loadPixels();

  //何故かずれるので１マスずらしてる
  for (j = 1; j < he - diff; j++) {
    for (i = 1; i < wi - diff; i++) {
      let c;
      if (wi == img.width && he == img.height) {
        c = img.get(i, j);
      } else {
        c = imgOriginal.get(i, j);

      }
      img0.set(i, j, c);
      img1.set(i, j, c);
      img2.set(i, j, c);
      img3.set(i, j, c);
    }
  }

  for (a = 0; a < rangedata.length; a++) {

    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        let c;
        if (PixelData[a][0][i + (wi - diff) * j] == 1) {
          if (wi == img.width && he == img.height) {
            c = img.get(i, j);
          } else {
            c = imgOriginal.get(i, j);
          }
          img0.set(i, j, c);
        }
      }
    }


    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (PixelData[a][0][i + (wi - diff) * j] == 1) {
          img1.set(i, j, color(PixelData[a][1][i + (wi - diff) * j]));
        }
      }
    }


    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (PixelData[a][0][i + (wi - diff) * j] == 1) {
          if (wi == img.width && he == img.height) {
            c = img.get(i, j);
          } else {
            c = imgOriginal.get(i, j);
          }
          img2.set(i, j, color(255 -
            red(c), 255 - blue(c), 255 - green(c)));
        }
      }
    }

    for (j = 0; j < he - diff; j++) {
      for (i = 0; i < wi - diff; i++) {
        if (PixelData[a][0][i + (wi - diff) * j] == 1) {
          img3.set(i, j, color(PixelData[a][2][i + (wi - diff) * j]));
        }
      }
    }



  }
  img0.updatePixels();
  img1.updatePixels();
  img2.updatePixels();
  img3.updatePixels();

  syorityu = false;
}

function imageReset(imG) {
  imG.resize(400, 0);
  if (imG.width >= 400) {
    imG.resize(400, 0);
  } else if (imG.height >= 300) {
    imG.resize(0, 300);
  }
  img0 = createImage(img.width, img.height);
  img1 = createImage(img.width, img.height);
  img2 = createImage(img.width, img.height);
  img3 = createImage(img.width, img.height);
  //画像の座標
  //始点
  imgx = 700 - imG.width / 2;
  imgy = 430 - imG.height / 2;
  //終点
  imgEx = imgx + imG.width;
  imgEy = imgy + imG.height;

  rangedata.length = 0;
  PixelData.length = 0;
}

//speedを求める関数
function Speed(efx, efy, elx, ely, mode) {
  var centerX = 0, centerY = 0;
  let speed;
  if (mode == 0) {
    centerX = (efx + elx) / 2;
    centerY = (efy + ely) / 2;
    speed = int(sqrt(sq(abs(mouseY - centerY)) + sq(abs(mouseX - centerX))));
    // speed=map(speed, 0, sqrt(sq(abs(ely-centerY))+sq(abs(elx-centerX))), 1, 5);

    if (elx - centerX > ely - centerY) {
      speed = map(speed, 0, abs(elx - centerX), 0, 5);
    } else {
      speed = map(speed, 0, abs(ely - centerY), 0, 5);
    }
  } else if (mode == 1) {
    centerX = efx;
    centerY = efy;
    speed = int(sqrt(sq(abs(mouseY - centerY)) + sq(abs(mouseX - centerX))));
    speed = map(speed, 0, sqrt(sq(abs(ely / 2 - centerY)) + sq(abs(elx / 2 - centerX))), 0, 5);
  }

  //クリックした位置の方向に運動させるために必要な画像の角度を求める
  speed = int(fm - speed);

  if (speed < 1) {
    speed = 1;
  }
  return speed;
}

class RangeData {//どこが選択されたかを表す（始点X，始点Y，終点X,終点Y,選択部分ののどこが押されたか（運動方向）X,Y）

  constructor(efX, efY, elX, elY, mousex, mousey, speed, mode, RassoPixelNum, movemode) {
    this.efX = efX;
    this.efY = efY;
    this.elX = elX;
    this.elY = elY;
    this.mousex = mousex; //動く方向
    this.mousey = mousey;
    this.mode = mode;
    this.speed = speed;
    this.RassoPixelNum = RassoPixelNum;
    this.movemode = movemode;
  }
}