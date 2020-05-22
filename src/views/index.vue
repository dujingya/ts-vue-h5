<template>
  <div class="containerList" ref="viewBox">
    <div v-show="loadError">
      <keep-alive>
        <reload-page ></reload-page>
      </keep-alive>
    </div>
    <div class="min">
      <div class="topBOX">
        <div class="breakfast_headBox">
          <div class="breakfast_head">您共有{{totalCount}}条评估记录</div>
        </div>
      </div>
      <div class="noData" v-if="totalPage === 0">暂无数据</div>
      <ul class="breakfast_wrapper" id="breakfast_content" v-else>
        <li v-for="(dataItem,index) in dataList" :key="index" v-if="dataItem.diseaseName">
          <a class="zheng detail" @click="reloadHref(dataItem)">
            <div class="zhengInfo">
              <div class="moreZheng">
                <span class="diseaseName">{{dataItem.diseaseName}}</span>
                <span class="line" v-if="dataItem.checkTypeName">-</span>
                <span class="yingyong" v-if="dataItem.checkTypeName">{{dataItem.checkTypeName}}</span>
              </div>
              <div class="time">
                <span class="source" v-if="dataItem.sourceName">{{dataItem.sourceName}}</span>
                <span class="line" v-if="dataItem.sourceName">|</span>
                {{dataItem.created.substr(0, 19)}}
              </div>
            </div>
            <div class="zhengDetail">
              <span class="text">报告详情</span>
              <img class="icon" src="../assets/img/icon_more.png">
            </div>
          </a>
        </li>
        <div class="noMoreData" v-if="noDataText">{{noDataText}}</div>
      </ul>
      <div v-if="noDataText || totalPage === -1">
        <Support></Support>
      </div>
    </div>
    <Loading v-if="loading"></Loading>
  </div>
</template>

<script lang="ts">
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import { Component, Vue, Model } from 'vue-property-decorator';
import { http } from '@/axios/http'
import * as API from '@/axios/api'
import store from 'store'
import Loading from '@/components/loading.vue'
import { toastMsg } from '@/utils/utils'

@Component({
    components: {
        Loading
    }
})
export default class Dashboard extends Vue {
    private noDataText: string = ''
    private dataList: any [] =  []
    private userId: string =  ''
    private userToken: string =  ''
    private avatarUrl: string =  ''
    private nickName: string =  ''
    private appKey: string =  ''
    private currentPage: number =  1
    private totalPage: number =  -1
    private loadError: boolean =  false
    private loading: boolean =  false
    private showScroller: boolean =  false
    private totalCount: number =  0
    private isLoading: boolean =  false
    private appSecret: string = ''
    private routerParams: any;
    private created() {
      console.log(1111)
    }
    private mounted() {
        this.init()
        // @ts-ignore
        this.$refs.viewBox.addEventListener('scroll', () => {
            if (this.isLoading) {
                return
            } else if (this.currentPage >= this.totalPage && this.totalPage >= 0) {
                console.log('滚动监听--不翻页了', this.currentPage, this.totalPage)
                return
            }
            if (this.getScrollTop() + this.getClientHeight() + 10 >= this.getScrollHeight()) {
                console.log('翻页啦')
                this.currentPage += 1
                this.getDatas()
            } else {
                console.log('你还没有到底部呢---')
            }
        })
    }
    private list = {
        data: {
            name: 'aaa'
        }
    }

    private getDatas () {
        this.loading = true // 控制loading组件的显示
        this.isLoading = true // 控制scroll页面滚动的时候，是否加载中
        let that = this
        let parameterData = {
            data: {
                currentPage: this.currentPage,
                pageSize: 15,
                checkTypeCode: '',
                source: ''
            },
            userId: this.userId
        }
        http({
            baseUrl: API.baseUrl,
            url: API.getUserResultList,
            method: 'POST',
            params: JSON.stringify(parameterData)
        }, (res) => {
            this.loading = false
            this.isLoading = false
            if (res && res.data && res.data.code === 20000) {
                let resData = res.data.data
                if (resData.list.result) {
                    that.dataList = that.dataList.concat(resData.list.result)
                }
                that.totalPage = resData.list.pageCount
                that.totalCount = resData.list.totalCount
                store.set('listToTalCount', that.totalCount)
                if (that.totalPage === 0) {
                    that.noDataText = '暂无数据'
                }
                if (that.currentPage >= that.totalPage && that.totalPage > 0) {
                    console.log('没有更多数据了')
                    that.noDataText = '没有更多数据了'
                }
            } else {
                that.noDataText = '暂无数据'
                toastMsg(res, this, API.getUserResultList)
            }
        }, (err) => {
            this.loading = false
            this.isLoading = false
            console.log('-----2', err)
        })
    }
    private getBalance (data) {
        this.loading = true
        let that = this
        let parameterData = {
            data: {
                seqNo: data.seqNo
            },
            userId: this.userId
        }
        http({
            baseUrl: API.baseUrl,
            url: API.getBalanceInfoBySeqNo,
            method: 'POST',
            params: JSON.stringify(parameterData)
        }, (res) => {
            console.log('-----1', res.data.data)
            this.loading = false
            if (res && res.data && res.data.code === 20000) {
                let resData = res.data.data
                let areas = resData.barycenterArea
                let percent = resData.balancingCapacity.score
                let percentStr = resData.balancingCapacity.appraise.name
                let vitalitystate = resData.balancingCapacity.state
                let sportCode = resData.balancingCapacity.appraise.code
                let barycenterCode = resData.quadrant.typeCode
                let age = ''
                let heartRate = ''
                window.location.href = `${API.balanceReport}?appkey=${this.appKey}&appSecret=${this.appSecret}&areas=${areas}&percent=${percent}&percentStr=${percentStr}&vitalitystate=${vitalitystate}&sportCode=${sportCode}&barycenterCode=${barycenterCode}&age=${age}&heartRate=${heartRate}`
            } else {
                that.noDataText = '暂无数据'
                toastMsg(res, this, API.getBalanceInfoBySeqNo)
            }
        }, (err) => {
            console.log(err)
            this.loading = false
        })
    }
    private init () {
        this.routerParams = this.$route.query
        if (this.routerParams.userId && this.routerParams.userId !== null && this.routerParams.userId !== 'null' && this.routerParams.userId !== 'undefind') {
            this.userId = this.routerParams.userId
        } else {
            this.userId = ''
        }
        // this.userId = this.routerParams.userId || ''
        if (this.routerParams.userToken && this.routerParams.userToken !== null && this.routerParams.userToken !== 'null' && this.routerParams.userToken !== 'undefind') {
            this.userToken = this.routerParams.userId
        } else {
            this.userToken = ''
        }
        // this.userToken = this.routerParams.userToken || ''
        console.log('项目整合----', this.routerParams, this.userId, this.userToken)
        if (!this.userId) {
            this.$toast('userId不存在')
            return
        }
        if (!this.routerParams.appKey || this.routerParams.appKey === 'undefined' || this.routerParams.appKey === null || this.routerParams.appKey === 'null') {
            this.$toast('appKey 不能为空')
            return false
        } else {
            this.appKey = this.routerParams.appKey
            store.set('appKey', this.appKey)
        }
        if (!this.routerParams.appSecret || this.routerParams.appSecret === 'undefined' || this.routerParams.appSecret === null || this.routerParams.appSecret === 'null') {
            this.$toast('appSecret 不能为空')
            return false
        } else {
            this.appSecret = this.routerParams.appSecret
            store.set('appSecret', this.appSecret)
        }
        this.dataList = []
        this.getDatas()
    }
    private reloadHref (data) {
        let dataTime = new Date().getTime()
        // if (data.checkTypeCode === 'BL') {
        //   console.log(111111)
        //   this.getBalance(data)
        //   return
        // }
        let theme = this.$route.query.theme ? '&theme=' + this.$route.query.theme : ''
        let LKfrom = this.$route.query.LKfrom ? '&LKfrom=LK' : ''
        switch (data.checkTypeCode) {
            case 'FACE_TONGUE_LK': // 察颜观舌
                window.location.href = `${API.zhengClickUrl}zhengReport?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${this.appKey}${theme}`
                break
            case 'PD': // 体质辨识
            case 'PD-FUZHEN':
                window.location.href = `${API.pdItemClickUrl}faceReport?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${this.appKey}${theme}&LKfrom=LK&v=${dataTime}` // appKey--K大写，因为生成二维码了
                break
            case 'QR':
                if (data.evaluateType === '13') {
                    window.location.href = `${API.questionNaireUrl}pressureReport?userId=${this.userId}&seqNo=${data.seqNo}&reStartVisibilty=false&fetchReportWay=5&userType=1&appkey=${this.appKey}&code=${data.evaluateType}${theme}${LKfrom}&v=${dataTime}`
                } else if (data.evaluateType === '10') {
                    window.location.href = `${API.questionNaireUrl}healthAssessment?userId=${this.userId}&seqNo=${data.seqNo}&reStartVisibilty=false&fetchReportWay=5&userType=1&appkey=${this.appKey}&code=${data.evaluateType}${theme}${LKfrom}&v=${dataTime}`
                } else {
                    window.location.href = `${API.questionNaireUrl}report?userId=${this.userId}&seqNo=${data.seqNo}&reStartVisibilty=false&fetchReportWay=5&userType=1&appkey=${this.appKey}&code=${data.evaluateType}${theme}${LKfrom}&v=${dataTime}`
                }
                break
            case 'VD': // 声音辨识
                window.location.href = `${API.vdItemClickUrl}faceReport?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${this.appKey}${theme}&LKfrom=LK&v=${dataTime}`
                break
            case 'WESTERN': // 体征
                window.location.href = `${API.phrUrl}/static/LkAppH5/westErn.html?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${API.phrAppKey}&appSecrect=${API.phrAppSecrect}&userType=1&userToken=${this.userToken}`
                break
            case 'URINE': // 尿检
                window.location.href = `${API.phrUrl}/static/LkAppH5/report.html?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${API.phrAppKey}&appSecrect=${API.phrAppSecrect}&userType=1&userToken=${this.userToken}`
                break
            case 'FACE_TONGUE': // 中医
                window.location.href = `${API.phrUrl}/static/LkAppH5/chineseMedicine.html?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${API.phrAppKey}&appSecrect=${API.phrAppSecrect}&userType=1&userToken=${this.userToken}`
                break
            case 'MULTIPLE': // 综合评估
                window.location.href = `${API.phrUrl}/static/LkAppH5/multiple.html?userId=${this.userId}&seqNo=${data.seqNo}&appKey=${API.phrAppKey}&appSecrect=${API.phrAppSecrect}&userType=1&userToken=${this.userToken}`
                break
            case 'BL': // 平衡秤
                this.getBalance(data)
                break
            default:
                break
        }
    }
    private getScrollTop () {
        // 获取ul容器当前已滚动的高度
        // @ts-ignore
        return this.$refs.viewBox.scrollTop
    }
    private getClientHeight () {
        // 获取当前可视范围的高度
        let clientHeight: number = 0
        if (document.body.clientHeight && document.documentElement.clientHeight) {
            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight)
        } else {
            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight)
        }
        return clientHeight
    }
    private getScrollHeight () {
        // 获取ul容器的高度
        // @ts-ignore
        return this.$refs.viewBox.scrollHeight
    }
}
</script>
<style lang=scss scoped>
  .containerList{
    height: 100%;
    background-color: #ffffff;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  .min{
    min-height: 100%;
    position: relative;
  }
  .noData, .noMoreData{
    text-align: center;
    color: #B7B7B7;
    height: 60px;
    line-height: 40px;
    font-size: 12px;
  }

  .topBOX{
    background: #EDEDED;
    z-index: 10000;
    width: 100%;
    height: 74px;
    padding-top: 38px;
  }
  .breakfast_headBox{
    background: #ffffff;
    border-radius: 30px 30px 0 0;
    width: 100%;
    height:40px;
    /*display: flex;
    flex-direction: column;
    align-items: center;*/
    /*top:55px;46*/
    position: relative;

    .breakfast_head{
      position: absolute;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 20px;
      left: 10%;
      /*margin: 0 46px;*/
      background: #33C09B;
      color: #ffffff;
      top:-20px;
      width: 80%;
      box-sizing: border-box;
      box-shadow: 0 2px 4px 0 rgba(57,236,220,0.08), 0 7px 12px 0 rgba(0,45,41,0.11);
      font-size: 14px;
    }
  }

  .breakfast_wrapper{
    padding-bottom: 16px;
    padding: 0 16px 0;
    position: relative;
    background-color: #ffffff;
    min-height: 100px;
    li{
      height: 68px;
      border-bottom: 1px solid #EEF6F4;
    }
    .time{
      font-size: 10px;
      padding-top: 5px;
      color: #ADADAD;
      .line{
        margin: 0 7px 0 17px;
      }
      .source{
        font-size: 12px;
        position: relative;
        left: 11px;
        &:before{
          position: absolute;
          content: '';
          width: 8px;
          height: 11px;
          background: url('../assets/img/defaultTheme/icon_source.png') no-repeat;
          background-size: 8px 11px;
          left: -11px;
          top: 1px;
        }
      }
    }
    .zheng{
      height: 68px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      color: #6F6F6F;
      font-size: 12px;
      .moreZheng{
        display: flex;
        align-items: flex-start;
        font-size: 14px;
        font-weight: bold;
        /*overflow: hidden;*/
        /*white-space: nowrap;*/
        /*text-overflow: ellipsis;*/
        .line{
          font-size: 12px;
          margin: 0 4px;
          font-weight: normal;
        }
        .yingyong{
          font-size: 12px;
          font-weight: normal;
        }
        .diseaseName{
          display: inline-block;
          max-width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          vertical-align: middle;
          color: #454848;
        }
      }
      .zhengInfo{
        display: flex;
        flex-direction: column;
        overflow: hidden;
        flex:1;
      }
      .zhengDetail{
        text-align: right;
        width: 90px;
        .icon{
          height: 15px;
          width: 3px;
          vertical-align: middle;
        }
      }
    }
    .text{
      margin-right: 5px;
    }
  }
</style>