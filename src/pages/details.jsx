import React from 'react';
import { useEffect, useState, lazy, Suspense } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";
import Spinner from '../components/Spinner'
const SideBar = lazy(() => import('../components/SideBar'))
const DetailsTile = lazy(() => import('../components/DetailsTile'))


export default function Details() {
    let params = useParams()
    const [todo, updateTodo] = useState(null)
    let [preloader, setPreloader] = useState(false)
    useEffect(() => {
        fetchTodo()
    })

    async function fetchTodo() {
        try {
            setPreloader(true)
            let response = await axios.get(`https://todo-test.herokuapp.com/todo/v1/${params.todoid}`)
            let fetchedData = response?.data?.data
            updateTodo(fetchedData)
            setPreloader(false)
        }
        catch (error) {
            console.log(error)
            setPreloader(false)
        }
    }
    return (
        <section className="hbox stretch">
            {
                <SideBar /> && <Suspense>
                    <SideBar />
                </Suspense>
            }

            <section id="content">
                <section className="vbox">
                    <header className="header bg-white b-b">
                        <p>View Todo</p>
                    </header>
                    <section className="scrollable wrapper">
                        <div className="row">
                            <div className="col-lg-8">

                                {
                                    !preloader && <Suspense fallback={<Spinner/>} >
                                        <DetailsTile todo={todo} />
                                    </Suspense>
                                }

                            </div>
                        </div>
                    </section>
                </section>
                {/* <a href="#" className="hide nav-off-screen-block" data-toggle="class:nav-off-screen" data-target="#nav"></a> */}
            </section>
        </section>
    )
}