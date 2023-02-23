import { useState } from "react"
export default function SideBar() {
    let [toggle, setToggle] = useState(false)
    return (
        <aside className={toggle ? 'nav-vertical bg-dark aside-md' : 'bg-dark aside-md'} id="nav">
            <section className="vbox">
                <header className="nav-bar dker">
                    <a className="btn btn-link visible-lg" data-toggle="class:nav-off-screen" data-target="#nav">
                        <i className="fa fa-bars"></i>
                    </a>
                    <a href="#" className="nav-brand" data-toggle="fullscreen">Todo app</a>
                    <a className="btn btn-link visible-lg" data-toggle="class:show" data-target=".nav-user">
                        <i className="fa fa-comment-o"></i>
                    </a>
                </header>
                <section>
                    <div className="lt nav-user pos-rlt">
                        <div className="nav-msg">
                            <section className="dropdown-menu m-l-sm pull-left animated fadeInRight">
                                <div className="arrow left"></div>
                                <section className="panel bg-white">
                                    <header className="panel-heading">
                                        <strong>You have <span className="count-n">2</span> notifications</strong>
                                    </header>
                                    <div className="list-group">
                                        <a href="#" className="media list-group-item">
                                            <span className="pull-left thumb-sm">
                                                <img src="images/avatar.jpg" alt="John said" className="img-circle" />
                                            </span>
                                            <span className="media-body block m-b-none">
                                                Use awesome animate.css
                                                {/* <br> */}
                                                <small className="text-muted">28 Aug 13</small>
                                            </span>
                                        </a>
                                        <a href="#" className="media list-group-item">
                                            <span className="media-body block m-b-none">
                                                1.0 initial released
                                                {/* <br> */}
                                                <small className="text-muted">27 Aug 13</small>
                                            </span>
                                        </a>
                                    </div>
                                    <footer className="panel-footer text-sm">
                                        <a href="#" className="pull-right"><i className="fa fa-cog"></i></a>
                                        <a href="#">See all the notifications</a>
                                    </footer>
                                </section>
                            </section>
                        </div>
                    </div>
                    <nav className="nav-primary hidden-xs">
                        <ul className="nav">
                            <li className="active">
                                <a href="/">
                                    <i className="fa fa-tasks"></i>
                                    <span>Tasks</span>
                                </a>
                            </li>
                            <li className="dropdown-submenu"></li>
                        </ul>
                    </nav>

                    <div className="bg-dark lter wrapper hidden-vertical animated fadeInUp text-sm">
                        <a href="#" data-dismiss="alert" className="pull-right m-r-n-sm m-t-n-sm"><i className="fa fa-times"></i></a>
                        Hi! this is a Todo app
                    </div>

                </section>
                <footer className="footer bg-gradient hidden-xs">
                    <div onClick={() => {
                        setToggle(!toggle)
                    }} className="btn btn-sm btn-link m-l-n-sm">
                    <i className="fa fa-bars"></i>
                    </div>
                    {/* <a href="#nav" data-toggle="class:nav-vertical" class="btn btn-sm btn-link m-l-n-sm">
                        
                    </a> */}
                </footer>
            </section>
        </aside>
    )
}