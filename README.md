
<h1>Texture Composer</h1>
<h3>This is the editor, and below ill list all of its features</h3>
<img src="[https://github.com/user-attachments/assets/093dbbe4-7b19-48c4-8fa5-cec6f0da3d81](https://github.com/user-attachments/assets/e891c5e8-a274-4a91-9846-5f649f6bad31)"/>
<details>
  <summary>Top Panel</summary>
  <img src="https://github.com/user-attachments/assets/8b387184-5b4b-4abc-a314-ada789c60791"/>
  <details>
    <summary>Project menu</summary>
    <h3>The project menu allows you to save your projects</h3>
    <p>You can also drop projects into the main window to load them</p> 
    <img src="https://github.com/user-attachments/assets/0000dff0-5931-469c-bd5e-239ada979232"/>
    <hr/>
  </details>
  <details>
    <summary>File menu</summary>
    <h3>The file menu allows you to load and create new files</h3>
    <p>You can also load files by dragging and dropping them into the main window</p> 
    <img src="https://github.com/user-attachments/assets/542b86f3-adb4-4c48-bc01-ee42281db4a9"/>
    <hr/>
  </details>
  <details>
    <summary>Render button</summary>
    <h3>The render button opens a modal that allows you to export your work into images</h3>
    <p>These filles will have the maximun resolution possible</p> 
    <p>You can right click on the name of each file to edit it</p> 
    <img src="https://github.com/user-attachments/assets/7994a46d-90aa-441f-9966-583e5c017702"/>
    <h3>You can click on the edit button, in order to change the medias of each output</h3>
    <img src="https://github.com/user-attachments/assets/ec133900-438f-4fc4-9920-56ee3f518e0b"/>
    <hr/>
  </details>
  <hr/>
</details>
<details>
  <summary>Right panel</summary>
  <h3>The right panel continas your files, the layer list and your change history</h3>
  <img src="https://github.com/user-attachments/assets/f604f3b1-b600-4f78-a46b-b6e18ec104a9"/>
  <details>
      <summary>File list</summary>
      <h3>You can click on each file in order to preview and edit it</h3>
      <p>You can drag and drop the files in order to reorder them</p> 
      <p>You can also create folders on the file menu, The folders work like colapsible separator to your files</p> 
      <img src="https://github.com/user-attachments/assets/3859a979-205b-493d-a50d-b235c124d7fc"/>
    <hr/>
  </details>
  <details>
      <summary>Layer list</summary>
      <h3>When a composition is selected your layers will appear here</h3>
      <p>You can drag and drop the layers in order to reorder them</p> 
      <p>The order of the layer list is important as lower layers will be rendered first</p> 
      <p>You can drag and drop any item from the file list into here</p> 
      <img src="https://github.com/user-attachments/assets/973229b5-6a0a-4987-b3f4-f056e0919961"/>
    <hr/>
  </details>
  <details>
    <summary>History list</summary>
    <h3>The history list contains all your changes</h3>
    <p>You can click on any change in order to revert your projeto to that version</p> 
    <p>You can press ctrl+z in order to revert the last change</p> 
    <p>You can press ctrl+y in order to go to a newer version</p> 
    <img src="https://github.com/user-attachments/assets/ac9d7253-0a3c-40aa-8789-521dbdf8c053"/>
    <hr/>
  </details>
</details>
  <details>
    <summary>Left pannel</summary>
    <h3>The left pannel continas the properties to all of the selected files</h3>
    <img src="https://github.com/user-attachments/assets/c3abec46-ab79-4a74-8b4b-94532d441e12"/>
    <details>
      <summary>Composition properties</summary>
      <p>The mask file, is an id map that can be used by the layers to display texture on certain areas</p> 
      <p>The normal output will use a shader to convert the composition final output to a normal map</p> 
      <p>The texutre swap tab allows you to easly swap any textures used by your composition</p> 
      <img src="https://github.com/user-attachments/assets/ba07a4f2-7a60-49be-aa0e-b117ef540abc"/>
      <hr/>
  </details>
  <details>
    <summary>The layer properties</summary>
    <p>The layer properties is the most adivanced menu of this program, it allows you modify your textures in various ways</p> 
    <p>No changes are lost, so you can easly modify the parameters of any change at any point</p> 
    <img src="https://github.com/user-attachments/assets/2343f0c3-1a63-4e3c-bad8-1efd205ec528"/>
    <details>
      <summary>Basic</summary>
      <p>On the basic tab, you can modify the file of the layer, wich is the base for rendering</p> 
      <p>You can drag and drop any files from the files tab into this input</p> 
      <img src="https://github.com/user-attachments/assets/cff74c2b-53a6-4671-8c4e-01ef5da0ace8"/>
      <hr/>
    </details>
    <details>
      <summary>Positioning</summary>
      <p>The positioning menu will tell where the layer will snap to its offset and if it will tile</p> 
      <img src="https://github.com/user-attachments/assets/187ac900-1464-41c9-9197-396a2c0c3abe"/>
      <hr/>
    </details>
    <details>
      <summary>Mask</summary>
      <p>In the mask tab you can tell wich part of the composition mask file this layer will apply</p> 
      <p>You can have an additional mask to the layer wich is another file, wich will be used as both luma and alpha msk</p> 
      <img src="https://github.com/user-attachments/assets/bc528b15-54c9-4c02-a34d-0a54101ba542"/>
      <hr/>
    </details>
    <details>
      <summary>Blending</summary>
      <p>The blending tab tells how your layer will blend with other layers</p> 
      <p>Here you can set the alpha, blend mode</p> 
      <p>You can also create your own blend mode by cheking and uncheging the channel boxes</p> 
      <img src="https://github.com/user-attachments/assets/ba9bea5e-d166-43ae-b10a-e9267a52dade"/>
      <hr/>
    </details>
    <details>
      <summary>Effects</summary>
      <p>In this tab you can add special effects to your layer, such as blur and gradient map</p> 
      <p>You can set up a custom masks to your blur wich tells how much each part of your texture will be blurred</p> 
      <p>The gradient map and all colors in this program support alpha, wich i found very usefull for blending texture maps</p> 
      <img src="https://github.com/user-attachments/assets/34cdfa6c-f28a-4f04-85b5-41529ff082d2"/>
      <hr/>
    </details>
    <details>
      <summary>Color correction</summary>
      <p>The color correction tab allow you to adjust some parameters on your layer color</p> 
      <img src="https://github.com/user-attachments/assets/a499cf00-65c7-4ab0-bd1a-7e7277b3f808"/>
      <hr/>
    </details>
    <hr/>

  </details>
  <details>
    <summary>Pattern Properties</summary>
      <h3>Each pattern type will have its own properties that you can configure</h3>
      <img src="https://github.com/user-attachments/assets/ac9d7253-0a3c-40aa-8789-521dbdf8c053"/>
      <details>
        <summary>Color properties</summary>
        <img src="https://github.com/user-attachments/assets/6a718741-9453-452c-a6e0-071751e15c6c"/>
        <hr/>
      </details>
      <details>
        <summary>Linear gradient properties</summary>
        <img src="https://github.com/user-attachments/assets/df31dde5-c682-4508-844f-1bf075d4bfc1"/>
        <hr/>
      </details>
      <details>
        <summary>Noise properties</summary>
        <img src="https://github.com/user-attachments/assets/2d16fdb9-0587-48a7-955f-a7992361b7b5"/>
        <hr/>
      </details>
    <hr/>
  </details>
  <hr/>
</details>


How to run:

Install nodejs

on the root folder run once
```bash
npm install
```

every time to start the dev server you can run
```bash
npm run dev
```
