"use client";

import React, { useEffect } from "react";
import { Avatar, Card, Col, Row } from "antd";
import Chart from 'chart.js/auto';


const { Meta } = Card;

const Page = () => {
    useEffect(() => {
        let config = {
          type: "bar",
          data: {
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
            ],
            datasets: [
              {
                label: new Date().getFullYear(),
                backgroundColor: "#4a5568",
                borderColor: "#4a5568",
                data: [30, 78, 56, 34, 100, 45, 13],
                fill: false,
                barThickness: 8,
              },
              {
                label: new Date().getFullYear() - 1,
                fill: false,
                backgroundColor: "#3182ce",
                borderColor: "#3182ce",
                data: [27, 68, 86, 74, 10, 4, 87],
                barThickness: 8,
              },
            ],
          },
          options: {
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: false,
              text: "Orders Chart",
            },
            tooltips: {
              mode: "index",
              intersect: false,
            },
            hover: {
              mode: "nearest",
              intersect: true,
            },
            legend: {
              labels: {
                fontColor: "rgba(0,0,0,.4)",
              },
              align: "end",
              position: "bottom",
            },
            scales: {
              xAxes: [
                {
                  display: false,
                  scaleLabel: {
                    display: true,
                    labelString: "Month",
                  },
                  gridLines: {
                    borderDash: [2],
                    borderDashOffset: [2],
                    color: "rgba(33, 37, 41, 0.3)",
                    zeroLineColor: "rgba(33, 37, 41, 0.3)",
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  scaleLabel: {
                    display: false,
                    labelString: "Value",
                  },
                  gridLines: {
                    borderDash: [2],
                    drawBorder: false,
                    borderDashOffset: [2],
                    color: "rgba(33, 37, 41, 0.2)",
                    zeroLineColor: "rgba(33, 37, 41, 0.15)",
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                  },
                },
              ],
            },
          },
        };
        let ctx = document.getElementById("bar-chart").getContext("2d");
        window.myBar = new Chart(ctx, config);
      }, []);

    return (
        <div>
            <div>
                <h1 style={{ fontSize: '25px', fontWeight: 'bold'}}>Dashboard</h1>
                <p style={{ paddingBottom: '20px'}}>Halo, Elisabet. Selamat Datang di Inventaris!</p>
                <Row gutter={[48, 48]}> {/* Mengatur jarak horizontal dan vertikal antara kartu-kartu */}
                    <Col>
                        <Card className="shadow-card" style={{ width: '200px', height: '130px'}}>
                            <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                            style={{ padding: '15px 20px 10px'}}
                            title="20"
                            description="Barang"
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow-card" style={{ width: '200px', height: '130px'}}>
                            <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                            style={{ padding: '15px 20px 10px'}}
                            title="3"
                            description="Peminjam"
                            />
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow-card" style={{ width: '200px', height: '130px'}}>
                            <Meta
                            avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />}
                            style={{ padding: '15px 20px 10px'}}
                            title="5"
                            description="Aktif"
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
            <div className="p-4 flex-auto">
                {/* Chart */}
                <div className="relative h-350-px">
                    <canvas id="bar-chart"></canvas>
                </div>
            </div>
        </div>
    );
        

};

export default Page;
