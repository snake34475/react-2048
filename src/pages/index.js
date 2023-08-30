import {Inter} from 'next/font/google'
import {useEffect, useState} from "react"

const inter = Inter({subsets: ['latin']})
import * as _ from 'lodash'
import {colorDir} from "@/utils";

const initArrAll = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]
const initGameInfo={
    source:0,
    historyTopSource:0,
}
export default function Home() {

    const [arrAll, setArrAll] = useState(_.cloneDeep(initArrAll))
    const [gameInfo,setGameInfo] = useState(initGameInfo)
    useEffect(() => {
        // console.log("arrAll", arrAll)
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [arrAll])

    useEffect(() => {
        initArr()
        initGameInfoFn()
        // const vConsole = new VConsole();
    }, [])

    const initGameInfoFn=()=>{
        setGameInfo({
            source:0,
            historyTopSource:localStorage.getItem("historyTopSource")||0,
        })
    }
    //重新开始
    const resetGame=()=>{
        initGameInfoFn()
        setArrAll(initArrAll)
        initArr(initArrAll)
    }
    //键盘控制
    const handleKeyDown = (e) => {
        //右边
        if (e.key === 'ArrowRight') {
            console.log("右边")
            //克隆
            let _arrAll = _.cloneDeep(arrAll)
            //反转到可执行方向
            _arrAll = _arrAll.map(arr => arr.reverse())
            //移动
            _arrAll = MoveAndMerge(_arrAll)
            //新增一个
            _arrAll = MathAdd(_arrAll)
            console.log("_arrAll", _arrAll)
            //翻转回正常
            _arrAll = _arrAll.map(arr => arr.reverse())
            setArrAll(_arrAll)
        }
        //左边
        if (e.key === 'ArrowLeft') {
            console.log("左边")
            let _arrAll = _.cloneDeep(arrAll)

            _arrAll = MoveAndMerge(_arrAll)
            _arrAll = MathAdd(_arrAll)
            setArrAll(_arrAll)
        }
        //上边
        if (e.key === 'ArrowUp') {
            console.log("上边")
            let _arrAll = _.cloneDeep(arrAll)
            _arrAll = xyTransforYx(_arrAll)
            _arrAll = MoveAndMerge(_arrAll)
            _arrAll = MathAdd(_arrAll)
            _arrAll = xyTransforYx(_arrAll)
            setArrAll(_arrAll)
        }
        //下边
        if (e.key === 'ArrowDown') {
            console.log("下边")
            let _arrAll = _.cloneDeep(arrAll)
            _arrAll = xyTransforYx(_arrAll)
            _arrAll = _arrAll.map(arr => arr.reverse())
            _arrAll = MoveAndMerge(_arrAll)
            _arrAll = _arrAll.map(arr => arr.reverse())
            _arrAll = MathAdd(_arrAll)
            _arrAll = xyTransforYx(_arrAll)
            setArrAll(_arrAll)
        }
    }

    //初始化两个坐标,随机生成两个
    const initArr = (arr=arrAll) => {
        const x1 = Math.floor(Math.random() * 4)
        const y1 = Math.floor(Math.random() * 4)
        const x2 = Math.floor(Math.random() * 4)
        const y2 = Math.floor(Math.random() * 4)
        let _arrAll = _.cloneDeep(arr)
        _arrAll[x1][y1] = 2
        _arrAll[x2][y2] = 2
        setArrAll(_arrAll)
    }

    //移动和合并
    const MoveAndMerge = (arrAll) => {
        return arrAll.map((arr, index) => {
            let _arr = arr.filter(item => item !== 0)
            //合并
            for (let i = 0; i < _arr.length; i++) {
                if (_arr[i] === _arr[i + 1]) {
                    _arr[i] = _arr[i] * 2
                    _arr[i + 1] = 0
                    //更新分数和最大值
                    const source = gameInfo.source+_arr[i]
                    const historyTopSource=gameInfo.historyTopSource
                    if(source<=historyTopSource){
                        setGameInfo({
                            ...gameInfo,
                            source,
                        })
                    }else{
                        setGameInfo({
                            ...gameInfo,
                            source,
                            historyTopSource: source
                        })
                    }
                    localStorage.setItem("historyTopSource",source)
                }
            }
            _arr = _arr.filter(item => item !== 0)
            const lg = arr.length - _arr.length
            if (lg > 0) {
                for (let i = 0; i < lg; i++) {
                    _arr.push(0)
                }
            }
            return _arr
        })
    }
    //xy颠倒
    const xyTransforYx = (arr) => {
        let _arr = [[], [], [], []]
        for (let x = 0; x < arr.length; x++) {
            for (let y = 0; y < arr[x].length; y++) {
                _arr[x][y] = arr[y][x]
            }
        }
        return _arr
    }
    //随机添加
    const MathAdd = (arr) => {
        let _arr = arr
        let endArr = _arr.map(item => item[3])
        let MathArr = []
        endArr.forEach((item, index) => {
            if (item === 0) {
                MathArr.push(index)
            }
        })
        let index = Math.floor(Math.random() * MathArr.length)
        _arr[index][3] = 2
        // _arr=_arr[index][3]
        return _arr
    }
    //基础生成
    const Cell = (props) => {

        return <div
            style={{backgroundColor: colorDir[props.val]}}
            className='w-24 h-24  text-center bg-amber-700 border-2 rounded-2xl flex items-center justify-center'>
            <p>{props.val || 0}</p>
        </div>
    }

    const FloatCell = () => {
        return <>
            {arrAll.map((item, index) => {
                return item.map((ite, inde) => <Cell key={inde} val={ite}></Cell>)
            })}
        </>
    }
    const KeyBoard = () => {
        return <div className='w-96 text-center'>
            <button className='h-16 w-16 border' onClick={() => handleKeyDown({key: 'ArrowUp'})}>上</button>
            <div>
                <button className='h-16 w-16 border' onClick={() => handleKeyDown({key: 'ArrowLeft'})}>左</button>
                <button className='h-16 w-16 border' onClick={() => handleKeyDown({key: 'ArrowDown'})}>下</button>
                <button className='h-16 w-16 border' onClick={() => handleKeyDown({key: 'ArrowRight'})}>右</button>
            </div>

        </div>
    }
    return (
        <main className='text-center'>
            <div className='grid grid-row-3 grid-cols-3 gap-4'>
                <div className='row-span-3 grid-cols-1 border rounded-2xl'>
                    <h2>2048</h2>
                    <h3>4*4</h3>
                </div>
                <div className='row-span-2 col-span-1  border rounded-2xl'>
                    <p>分数</p>
                    <p>{gameInfo?.source}</p>
                </div>
                <div className='row-span-2 col-span-1  border rounded-2xl'>
                    <p>最高分数</p>
                    <p>{gameInfo?.historyTopSource}</p>
                </div>

                <div className='row-span-1 col-span-1 border rounded-2xl' onClick={()=>resetGame()}>重新开始</div>
                <div className='row-span-1 col-span-1 border rounded-2xl'>返回菜单</div>
            </div>
            <h1>2048</h1>
            <div className="w-96 h-96 bg-amber-100 flex flex-wrap">
                <FloatCell></FloatCell>
            </div>
            <KeyBoard></KeyBoard>
        </main>
    )
}
