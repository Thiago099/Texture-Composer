<script>
  import { SaveModalManager } from "../../modules/saveModalManager.svelte";
  import Text from "../inputs/Text.svelte";
  import Modal from "../Modal.svelte";
  const manager = SaveModalManager.GetSingleton()
  </script>
  <Modal width={600} height={200} bind:this={manager.modal} >
    <div class="top">
      {manager.message}
    </div>
    <div style="margin-top: 30px;">
      <Text bind:value={manager.fileName}></Text>
    </div>
    <div class="bottom">
      <button class="button" onclick={manager.CancelEvent()}>Cancel</button>
      <button class="button" onclick={manager.ConfirmEvent()}>Save</button>
    </div>
  </Modal>

  <style>
    .button{
      padding: 10px 30px ;
      margin: 10px;
    }
    .top{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 5px 0;
      font-size: 1.5em;
    }
    .bottom{
      width: 100%;
      position: absolute;
      bottom:0;
      display: flex;
      justify-content: space-between;
    }
  </style>