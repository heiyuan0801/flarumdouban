import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import TextEditor from 'flarum/common/components/TextEditor';
import Button from 'flarum/common/components/Button';
import Modal from 'flarum/common/components/Modal';

class DoubanSearchModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
    this.searchResults = [];
    this.detailResult = null;
    this.searchKeyword = '';
  }

  className() {
    return 'DoubanSearchModal Modal--large';
  }

  title() {
    return '豆瓣信息搜索';
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            <input
              type="text"
              className="FormControl"
              placeholder="输入关键词搜索..."
              value={this.searchKeyword}
              oninput={(e) => {
                this.searchKeyword = e.target.value;
                if (this.searchKeyword.length > 1) {
                  this.search();
                }
              }}
            />
          </div>
          {this.loading && <div className="Loading">加载中...</div>}
          {this.detailResult ? (
            this.renderDetail()
          ) : (
            <div className="DoubanSearchResults">
              {this.searchResults.map((item) => this.renderSearchItem(item))}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderSearchItem(item) {
    return (
      <div className="DoubanSearchItem" onclick={() => this.loadDetail(item.link)}>
        <div className="DoubanSearchItem-title">{item.title}</div>
        <div className="DoubanSearchItem-meta">{item.year}</div>
      </div>
    );
  }

  renderDetail() {
    const detail = this.detailResult;
    const content = `[douban]
标题：${detail.chinese_title}
年份：${detail.year}
类型：${(detail.genre || []).join('/')}
导演：${(detail.director || []).map(d => d.name).join('/')}
评分：${detail.douban_rating}
简介：${detail.introduction}
[/douban]`;

    return (
      <div className="DoubanDetail">
        <div className="DoubanDetail-poster">
          <img src={detail.poster} alt={detail.chinese_title} />
        </div>
        <div className="DoubanDetail-info">
          <pre>{content}</pre>
          <Button
            className="Button Button--primary"
            onclick={() => {
              this.insertContent(content);
              app.modal.close();
            }}
          >
            插入内容
          </Button>
          <Button
            className="Button"
            onclick={() => {
              this.detailResult = null;
              m.redraw();
            }}
          >
            返回搜索
          </Button>
        </div>
      </div>
    );
  }

  search() {
    this.loading = true;
    app
      .request({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + '/douban/search',
        params: { search: this.searchKeyword },
      })
      .then((result) => {
        this.searchResults = result.data || [];
        this.loading = false;
        m.redraw();
      })
      .catch((error) => {
        this.loading = false;
        m.redraw();
      });
  }

  loadDetail(url) {
    this.loading = true;
    app
      .request({
        method: 'GET',
        url: app.forum.attribute('apiUrl') + '/douban/search',
        params: { url },
      })
      .then((result) => {
        this.detailResult = result;
        this.loading = false;
        m.redraw();
      })
      .catch((error) => {
        this.loading = false;
        m.redraw();
      });
  }

  insertContent(content) {
    const textarea = this.attrs.textArea;
    const insert = textarea.insertAtCursor.bind(textarea);
    insert(content);
  }
}

app.initializers.add('doubanapi/douban', () => {
  extend(TextEditor.prototype, 'toolbarItems', function (items) {
    items.add(
      'douban',
      <Button
        className="Button Button--icon"
        onclick={() => app.modal.show(DoubanSearchModal, { textArea: this })}
        icon="fas fa-search"
        title="搜索豆瓣信息"
      />
    );
  });
});