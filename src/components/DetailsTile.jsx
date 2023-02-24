import React from 'react';
import {fromIsoToDateString} from "../services/helper" 
export default function DetailsTile({todo}) {
    return (
        <section className="panel no-borders hbox col-lg-3 col-sm-3">
            <aside>
                <div className="pos-rlt">
                    <span className="arrow right hidden-xs"></span>
                    <div className="panel-body">
                        <div className="clearfix m-b">
                            <div href="" className="thumb-sm pull-left m-r">
                                <img height="100" width="100" src={todo?.image_link ? todo?.image_link : 'images/avatar.jpg'} alt='Todo' className="img-circle" />
                            </div>
                            <div className="clear">
                                <small className="block text-muted">{ fromIsoToDateString(todo?.start_date) } - { fromIsoToDateString(todo?.end_date) }
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
            <aside className="bg-primary clearfix lter r-r text-right v-middle">
                <div className="wrapper h3 font-thin">
                    {todo?.description}
                </div>
            </aside>
        </section>
    )
}