import {Component} from "react";
import {Outlet} from "react-router-dom";
import {Navigation} from "./Navigation";

export class Layout extends Component {
    render() {
        return (
            <div>
                {<Navigation/>}
                <div className={'container'}>
                    <Outlet/>
                </div>
            </div>
        )
    }
}