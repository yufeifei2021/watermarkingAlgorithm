import { Button, Table } from '@aloudata/aloudata-design';
import { ArrowsRightSmLine } from '@aloudata/icons-react';
import { useMount } from 'ahooks';
import { useState } from 'react';
import { history } from 'umi';
import { ELight, tableButtonList } from '../AddOrExtract/type';
import styles from './index.less';

interface ITableData {
  type: string;
  stretch: string;
  rotate: string;
  prune: string;
}

export default function TableList() {
  const [tableData, setTableData] = useState<ITableData[]>([]);
  const ZERO = 0;

  const handleReturn = () => {
    history.push('/buttons/robustness');
  };

  useMount(() => {
    getButtonList();
  });

  const getButtonList = () => {
    const temp: ITableData[] = [];
    tableButtonList.map((item) => {
      return temp.push({
        type: item.tab,
        stretch:
          item.tab === ELight.DIV ||
          item.tab === ELight.CANVAS ||
          item.tab === ELight.SVG
            ? '✅'
            : '❌',
        rotate:
          item.tab === ELight.DIV ||
          item.tab === ELight.CANVAS ||
          item.tab === ELight.SVG
            ? '✅'
            : '❌',
        prune:
          item.tab === ELight.DIV ||
          item.tab === ELight.CANVAS ||
          item.tab === ELight.SVG
            ? '✅'
            : '❌',
      });
    });
    setTableData(temp);
  };

  const columns = [
    {
      title: '水印种类',
      dataIndex: 'type',
      minWidth: 300,
      widthFlex: true,
    },
    {
      title: '拉伸',
      dataIndex: 'stretch',
      minWidth: 200,
    },
    {
      title: '旋转',
      dataIndex: 'rotate',
      minWidth: 200,
    },
    {
      title: '剪裁',
      dataIndex: 'prune',
      minWidth: 200,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <div className={styles.iconLeft}>查看鲁棒性对比表格</div>
          <div className={styles.iconRight}>
            <Button onClick={handleReturn}>
              <span>返回</span>
              <ArrowsRightSmLine />
            </Button>
          </div>
        </div>
        <div className={styles.wrapperContent}>
          {tableData.length > ZERO && (
            <Table
              columns={columns}
              data={tableData}
              resizeColumn
              height={'100%'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
