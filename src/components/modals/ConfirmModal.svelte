<script>
  import { ConfirmModalManager } from "../../modules/confirmModalManager.svelte";
  import Modal from "../Modal.svelte";
  const confirmModalManager = ConfirmModalManager.GetSingleton()
  </script>
  <Modal width={600} height={150} bind:this={confirmModalManager.modal} >
    <div class="top">
      {confirmModalManager.message}
    </div>
    <div class="bottom">
      <button class="button" onclick={confirmModalManager.CancelEvent()}>No</button>
      <button class="button" onclick={confirmModalManager.ConfirmEvent()}>Yes</button>
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