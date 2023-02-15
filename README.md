# watermarkingAlgorithm

'''

│   .eslintrc.js
│   .gitignore
│   .prettierignore
│   .prettierrc
│   .stylelintrc.json
│   .umirc.js
│   package.json
│   project.txt
│   README.md
│   tsconfig.json
│   typings.d.ts
│   vitest.config.ts
│   vitest.setup.ts
│   yarn.lock
│   
├───src
│   │   app.ts
│   │   types.ts
│   │   
│   ├───common
│   │   └───utils
│   │           cryptostego.min.js
│   │           index.ts
│   │           request.tsx
│   │           
│   ├───i18n
│   │   │   index.ts
│   │   │   
│   │   └───resources
│   │       │   en.ts
│   │       │   fr.ts
│   │       │   
│   │       └───index
│   │               en.json
│   │               fr.json
│   │               
│   ├───layouts
│   │       index.less
│   │       index.tsx
│   │       
│   ├───pages
│   │   ├───AddExtractWatermark
│   │   │       index.less
│   │   │       index.tsx
│   │   │       
│   │   ├───Buttons
│   │   │       index.less
│   │   │       index.tsx
│   │   │       
│   │   ├───Index
│   │   │   │   index.less
│   │   │   │   index.tsx
│   │   │   │   
│   │   │   ├───components
│   │   │   │   ├───AddOrExtract
│   │   │   │   │       index.less
│   │   │   │   │       index.tsx
│   │   │   │   │       type.tsx
│   │   │   │   │       
│   │   │   │   ├───darkWatermarking
│   │   │   │   │   ├───BLANKRAREA
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   ├───DCT
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   ├───DFT
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   ├───LSB
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   ├───TEXT
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   └───utils
│   │   │   │   │           1.html
│   │   │   │   │           2.html
│   │   │   │   │           audioUtil.js
│   │   │   │   │           helper.tsx
│   │   │   │   │           main.js
│   │   │   │   │           opencv.js
│   │   │   │   │           opencvHelper.ts
│   │   │   │   │           
│   │   │   │   ├───Middleware
│   │   │   │   │       index.tsx
│   │   │   │   │       
│   │   │   │   ├───openWatermark
│   │   │   │   │   ├───Canvas
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   ├───Div
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   ├───Svg
│   │   │   │   │   │       index.less
│   │   │   │   │   │       index.tsx
│   │   │   │   │   │       
│   │   │   │   │   └───VIDEO
│   │   │   │   │           index.less
│   │   │   │   │           index.tsx
│   │   │   │   │           
│   │   │   │   ├───SaveDoubleImages
│   │   │   │   │       index.less
│   │   │   │   │       index.tsx
│   │   │   │   │       
│   │   │   │   ├───Superposition
│   │   │   │   │       helper.tsx
│   │   │   │   │       index.less
│   │   │   │   │       index.tsx
│   │   │   │   │       type.tsx
│   │   │   │   │       
│   │   │   │   ├───TableList
│   │   │   │   │       index.less
│   │   │   │   │       index.tsx
│   │   │   │   │       
│   │   │   │   └───Uploads
│   │   │   │           index.less
│   │   │   │           index.tsx
│   │   │   │           
│   │   │   └───module
│   │   │           atom.ts
│   │   │           
│   │   ├───Robustness
│   │   │       index.less
│   │   │       index.tsx
│   │   │       
│   │   └───WatermarkSuperposition
│   │           index.less
│   │           index.tsx
│   │           
│   ├───services
│   │   └───user
│   │           index.ts
│   │           types.ts
│   │           
│   └───styles
│           globals.css
│           
└───tests
    ├───component
    │   │   checkbox.test.tsx
    │   │   Checkbox.tsx
    │   │   
    │   └───__snapshots__
    │           checkbox.test.tsx.snap
    │           
    ├───hooks
    │       useCounter.test.ts
    │       useCounter.ts
    │       
    └───utils
            index.test.ts
'''
            
  div-文字水印
  算法：
       水印生成方式为：div，通过 absolute 布局将div所处的层级提高，并降低透明度，
       从而实现将水印覆盖到原图上方并且不会太过明显影响原图信息。
 


  canvas-文字水印
  算法：
       水印生成方式为：canvas，通过 absolute 布局将div所处的层级提高，并降低透明度，
       从而实现将水印覆盖到原图上方并且不会太过明显影响原图信息。
 


  svg-文字水印
  算法：
       水印生成方式为：svg，通过 absolute 布局将div所处的层级提高，并降低透明度，
       从而实现将水印覆盖到原图上方并且不会太过明显影响原图信息。
 


  视频-文字水印
  算法：
       水印生成方式为：div，通过 absolute 布局将div所处的层级提高，并降低透明度，
       从而实现将水印覆盖到原图上方并且不会太过明显影响原图信息。
 


  空域-二值化图像水印
  算法：
       1.通过canvas将原图转化为argb数组，同时用canvas绘制同等大小的水印图像，同样转化为argb数组；
       2.将原图的argb中的red位置元素的最后一位舍去（red取值为0～255）即偶数不变，奇数-1；
       3.判断水印图像的同一像素点的元素的alpha的值是否为0，不为0说明当前像素点有文字像素存在，
         将原图的argb中的red位置元素的最后一位置为1，即原值+1；
       4.将原图的改变后的argb数组重新写入canvas中并生成base64图像。
       5.提取水印：遍历修改后的图的argb数组，如果red位置为奇数（最后一位为1），
         则将对应位置的水印像素点rgb置为255，否则置为0，alpha位置都是255，
         然后将生成的水印argb数组通过canvas显示在img中。
       ————此算法计算复杂度相对较低；对图像视觉效果影响很小；鲁棒性较低，难以抵抗常见的水印攻击手段。
 


  变换域DCT-文字水印
  原理：
       1.离散余弦变换(DCT)是一组不同频率和幅值的余弦函数和来近似一副图像，实际上是傅里叶变换的实数部分；
       2.离散余弦变量对于一副图像，其大部分可视化信息都集中在少数的变换系数上；
       3.离散余弦变量是数据压缩常用的一个变换编码方法，它能将高相关数据能量集中，使得它非常适用于图像压缩。
  算法：
       1.将图像分解为88的图像块，之后进行量化；
       2.在量化过程中，从左至右，从上至下对每个图像块做DCT变换，舍弃高频分量，剩下的低频分量被保存下来用于后期图像重建；
       3.对余下的图像块进行量化压缩，由压缩后的数据所组成的图像大大缩减了存储空间；
       4.解压缩时对每个图像块做DCT反转换（IDCT），然后重建一幅完整的图像；
       5.由于舍弃了某些频率的图像，所以最终呈现出来的图像清晰度会有差异。
       ————此算法通用性比较强，在分块和频域位置选择合理的情况下，可以抵抗一定程度裁剪、缩放和压缩等常见的攻击手段。
 


  文本-文字水印
  原理：
     1.基于不可见编码的技术，包括替换法、追加法、基于冗余编码的技术、字符的图形与编码相互独立的技术等；
     2.基于文本内容的技术，包括同义词替换技术、基于句法的文本数字水印技术、基于语义的文本数字水印技术等；
  算法：
     1.基于”不可见编码的技术”对文本进行水印添加；
     2.Unicode 中有一类格式字符，不可见，不可打印，主要作用于调整字符的显示格式，所以我们将其称为零宽字符。
 


  音频LSB-文字水印
  原理：
     1.音频的隐藏水印，是指在耳朵可感知的频率之外的音频信息中嵌入水印信息；
     2.这样既可以对音频产生较小的干扰，又可以将水印信息嵌入当中；
     3.对音频信号进行采样，将不敏感的采样值进行二进制位代替，以达到在音频信号中嵌入水印数据的目的。
  算法：
     同空域-二值化图像水印
     ————既可以对音频产生较小的干扰，又可以将水印信息嵌入当中。
 
