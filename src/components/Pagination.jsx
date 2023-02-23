import React from 'react';
import Pagination from 'react-bootstrap/Pagination';
export default function Paginator({ changePage }) {
    let items = [];
    for (let number = 1; number <= 5; number++) {
        items.push(
            <Pagination.Item onClick={(ev) => {
                changePage(number)
            }} active={false} key={number} >
                {number}
            </Pagination.Item>,
        );
    }

    items.unshift(<Pagination.Item onClick={(ev) => {
        changePage(1)
    }} key={0} ><i className="fa fa-chevron-left"></i></Pagination.Item>)
    items.push(<Pagination.Item onClick={(ev) => {
        changePage(5)
    }} key={items.length}><i className="fa fa-chevron-right"></i></Pagination.Item>)
    return (
        <div>
            <Pagination size="lg">
                {items}
            </Pagination>
        </div>
    )
}