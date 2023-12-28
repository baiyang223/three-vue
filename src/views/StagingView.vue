<script setup lang="ts">

</script>

<template>
  <div class="stagingMain">
    stagingMain
    <svg-icon name="outLogin" color="red" width="100px" height="100px" />
  </div>
</template>

<style scoped lang="scss">
.stagingMain {
  width: 100%;
  height: 100%;
  padding: 24px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .personnelHead {
    height: 100%;
    width: 100%;

    .headText {
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .headSearch {
      width: 100%;
      height: 92px;
      margin-top: 16px;
      border-radius: 10px;
      background-color: #fff;
      display: flex;

      .headSearchBox {
        width: 30%;
        margin: auto 20px;

        .inputWH {
          width: 80%;
          height: 38px;
          margin-left: 10px;
        }

        .name {
          color: #333;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: normal;
        }
      }

      .headBtn {
        margin-top: 26px;
        height: 38px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        border: 1px solid #00B54B;
        width: 112px;
        margin-right: 24px;
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
        color: #00B54B;
      }

      .btnBG {
        background-color: #00B54B;
        color: #fff;
        margin-left: 52px;

      }

    }

    .personnelContent {
      width: calc(100% - 1px);
      max-width: calc(100% - 1px);
      min-width: calc(100% - 1px);
      height: calc(100vh - 273.5px);
      margin-top: 20px;
      background-color: #fff;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      // justify-content: space-between;
      position: relative;

      .contentHead {
        display: flex;
        justify-content: space-between;
      }

      .contentBtn {
        display: flex;
        color: #fff;
        background-color: #00B54B;
        border-radius: 8px;
        margin: 20px;
        font-size: 16px;
        cursor: pointer;

        span {
          margin-left: 10px;
        }

      }

      .conentTable {
        width: 99%;
        // max-width: 99%;;
        // min-width: 99%;;
        flex: 1;
        padding: 20px 4px 20px 24px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-height: 100%;
        overflow: hidden;
        overflow-y: auto;
      }
    }
  }

}

:deep(.el-table) {
  flex: 1;
  margin-bottom: 10px;

  .el-table__header-wrapper {
    border-radius: 6px;
    overflow: hidden;

    tr,
    th {
      background: #EAEBEA;
      color: #000;
    }
  }

  .cell {
    .btn {
      margin-right: 10px;
      cursor: pointer;
      font-size: 14px;
      color: #333;

      &.active {
        color: #00903E;
      }
    }
  }
}

:deep(.el-pagination) {

  button,
  li {
    border: 1px solid #DEDEDE;
  }

  .is-active {
    background: #00B54B;
    color: #fff;
    border-color: transparent;
  }
}

:deep(.el-dialog) {
  padding: 48px 60px;
  border-radius: 10px;

  .el-dialog__header {
    padding-top: 10px;
    color: #333;
    font-size: 22px;
    font-weight: 600;
  }

  .el-form-item {
    flex-direction: column;
    align-items: flex-start;

    .el-form-item__content {
      width: 100%;

      .el-select {
        width: 100%;
      }
    }
  }

  .el-button {
    border-radius: 8px;
    background: #00B54B;
    box-shadow: 0px 6px 12px 0px rgba(0, 181, 75, 0.26);
    padding: 15px 30px;
  }
}

.demo-ruleForm {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .form-item {
    width: 49%;
  }
}

.gender {
  padding: 1px 15px;
  border: 1px #ECECEC solid;
  margin-right: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.genderHover {
  background-color: #00B54B;
  color: #fff;
}
</style>
