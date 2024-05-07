"use client";

import React from "react";
import {Button, Card} from "antd";
import {store} from "#/store";
import {sampleRepository} from "#/repository/sample";

const Page = () => {
    const { data, error, isLoading }  = sampleRepository.hooks.useJoke();
    return <div>
        <div>
            Dashboard: {store.ui.title}
        </div>
    </div>;
};

export default Page;

