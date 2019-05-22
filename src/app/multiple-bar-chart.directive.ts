import { Directive, Input, ElementRef, OnChanges, OnInit } from '@angular/core';

import * as d3 from 'd3';
import d3Tip from 'd3-tip';

@Directive({
  selector: '[multipleBarChart]'
})
export class MultipleBarChartDirective implements OnInit, OnChanges {
  @Input() width = 459;
  @Input() height = 252;
  @Input() margin = { top: 50, right: 20, bottom: 50, left: 100 };
  @Input() data = [
    {
      "name": "30 days",
      "series": [
        {
          "name": "TS",
          "value": 45
        },
        {
          "name": "Subscription",
          "value": 78
        }, {
          "name": "Cloud",
          "value": 96
        }
      ]
    },

    {
      "name": "60 days",
      "series": [
        {
          "name": "TS",
          "value": 87
        },
        {
          "name": "Subscription",
          "value": 49
        }, {
          "name": "Cloud",
          "value": 72
        }
      ]
    },
    {
      "name": "90 days",
      "series": [
        {
          "name": "TS",
          "value": 90
        },
        {
          "name": "Subscription",
          "value": 58
        }, {
          "name": "Cloud",
          "value": 73
        }
      ]
    }
  ];
  @Input() color;

  public tip = d3Tip()
    .attr('class', 'addPopUp')
    .offset([-10, 0])
    .html((d, value, type) => {
      return '<div class="customPopover"> <div class="content" style="background-color:fff;">' +
        '<ul class="addPopUp__list"><li class="addPopUp__item"><span class="lbl">' + d.name + '</span><span class="val">' + type + ":" + value + '</span></li></div></div>';
    });
  constructor(private element: ElementRef) { }

  ngOnChanges() {
    this.drawChart();
  }

  ngOnInit() {
    this.drawChart();
  }

  drawChart() {
    let svg = d3.select(this.element.nativeElement);
    svg.selectAll("*").remove();
    svg = d3.select(this.element.nativeElement)
      .append('svg')
      .attr("width", this.width)
      .attr("height", this.height);
    this.width = +svg.attr("width") - this.margin.left - this.margin.right;
    this.height = +svg.attr("height") - this.margin.top - this.margin.bottom;

    let x = d3.scaleBand().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);

    let g = svg.append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    x.domain(this.data.map(function (d) { return d.name; })).padding(0.6);
    y.domain([0, d3.max(this.data, function (item) { return d3.max(item.series, function (d) { return d.value; }); })]);

    g.append("g")
      .attr("class", "x axis tickhide")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(x).tickSizeOuter(0));

    g.append("g")
      .attr("class", "y axis")
      .call(d3.axisLeft(y).ticks(4).tickFormat(function (d) {
        if (d >= 1000000000)
          return (parseInt(d) / 1000000000) + 'B';
        else if (d >= 1000000)
          return (parseInt(d) / 1000000) + 'M';
        else if (d >= 1000)
          return (parseInt(d) / 1000) + 'K';
        else
          return d;
      }).tickSizeInner([-this.width]).tickSizeOuter(0));
    const self = this;
    g.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar1")
      .attr("x", d => x(d.name))
      .attr("height", d => this.height - y(d["series"][0]["value"]))
      .attr("y", d => y(d["series"][0]["value"]))
      .attr("width", 20)
      .attr('fill', '#0E709E')
      .on("mouseover", function (d) {
        let value;
        if (d["series"][0]["value"] >= 1000000000)
          value = parseFloat('' + parseInt(d["series"][0]["value"]) / 1000000000).toFixed(2) + 'B';
        else if (d["series"][0]["value"] >= 1000000)
          value = parseFloat('' + parseInt(d["series"][0]["value"]) / 1000000).toFixed(2) + 'M';
        else if (d["series"][0]["value"] >= 1000)
          value = parseFloat('' + parseInt(d["series"][0]["value"]) / 1000).toFixed(2) + 'K';
        self.tip.show(d, value, d["series"][0]["name"], this);
      })
      .on("mouseout", function (d) { self.tip.hide(d, d["series"][0]["value"], d["series"][0]["name"], this); });

    g.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar2")
      .attr("x", d => 20 + x(d.name))
      .attr("height", d => this.height - y(d["series"][1]["value"]))
      .attr("y", d => y(d["series"][1]["value"]))
      .attr("width", 20)
      .attr('fill', '#67C1BA')
      .on("mouseover", function (d) {
        let value;
        if (d["series"][1]["value"] >= 1000000000)
          value = parseFloat('' + parseInt(d["series"][1]["value"]) / 1000000000).toFixed(2) + 'B';
        else if (d["series"][1]["value"] >= 1000000)
          value = parseFloat('' + parseInt(d["series"][1]["value"]) / 1000000).toFixed(2) + 'M';
        else if (d["series"][1]["value"] >= 1000)
          value = parseFloat('' + parseInt(d["series"][1]["value"]) / 1000).toFixed(2) + 'K';
        self.tip.show(d, value, d["series"][1]["name"], this);
      })
      .on("mouseout", function (d) { self.tip.hide(d, d["series"][1]["value"], d["series"][1]["name"], this); });

    g.selectAll(".bar")
      .data(this.data)
      .enter().append("rect")
      .attr("class", "bar3")
      .attr("x", d => 40 + x(d.name))
      .attr("height", d => this.height - y(d["series"][2]["value"]))
      .attr("y", d => y(d["series"][2]["value"]))
      .attr("width", 20)
      .attr('fill', '#C3CE3D')
      .on("mouseover", function (d) {
        let value;
        if (d["series"][2]["value"] >= 1000000000)
          value = parseFloat('' + parseInt(d["series"][2]["value"]) / 1000000000).toFixed(2) + 'B';
        else if (d["series"][2]["value"] >= 1000000)
          value = parseFloat('' + parseInt(d["series"][2]["value"]) / 1000000).toFixed(2) + 'M';
        else if (d["series"][2]["value"] >= 1000)
          value = parseFloat('' + parseInt(d["series"][2]["value"]) / 1000).toFixed(2) + 'K';
        self.tip.show(d, value, d["series"][2]["name"], this);
      })
      .on("mouseout", function (d) { self.tip.hide(d, d["series"][2]["value"], d["series"][2]["name"], this); });
    g.call(this.tip);

    let legendText = [];
    for (let i in this.data[0]["series"]) {
      legendText.push(this.data[0]["series"][i]["name"]);
    }
    let colors = ['#0E709E', '#67C1BA', '#C3CE3D'];

    let table = d3.select(this.element.nativeElement).append('table');
    const legend = table.attr('class', 'legend double-barChart-legends');
    const tr = legend.append('tr');
    const td = tr.selectAll('td').data(legendText).enter().append('td');
    //const div = td.append('div');
    td.append('svg').attr('width', '8').attr('height', '8').append('rect')
      .attr('x', 4)
      .attr('y', 4)
      .attr('width', '8').attr('height', '8')
      .attr('fill', (d, i) => colors[i]);

    td.append('text')
      .text(function (d) {
        return d;
      });


    /* X axis labels are moved down*/
    g.selectAll(".x text")
      .attr("y", "10");
  }
}
