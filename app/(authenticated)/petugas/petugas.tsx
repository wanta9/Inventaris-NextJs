"use client";

import React from "react";
import {Button, Card} from "antd";
import {store} from "#/store";

const petugas = () => {
    return <div>
        petugas: {store.ui.title}
        <Button onClick= {() => {
            store.ui.changeTitle("from petugas")
        }}>change title</Button>
    </div>;
};

export default petugas;

