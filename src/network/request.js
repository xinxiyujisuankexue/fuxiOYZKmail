import axios from 'axios'

export function request(config) {
  const instance = axios.create({
    baseURL: 'http://152.136.185.210:8000/api/n3',
    timeout:5000
  })
  // axios的拦截器
  // instance.interceptors.request.use(config=>{
  //   return config
  // },err=>{
  //   // console.log(err);
  // })
  // instance.interceptors.responce.use(res=>{
  //   return res.data
  // },err=>{
  //   console.log(err);
  // })

  // 3.发送真正的网络请求
  return instance(config)
}