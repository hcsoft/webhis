package hcsoft.db;

public class DbPageVO {
	private int currentpage = 1;
	private int pagecount = 0;
	private int pagesize = 15;
	private int rowcount = 0;
	public DbPageVO(){
	}
	public DbPageVO(int currentpage,int pagecount,int pagesize,int rowcount ){
		this.currentpage = currentpage;
		this.pagecount = pagecount;
		this.pagesize = pagesize;
		this.rowcount = currentpage;
	}
	public static DbPageVO defaultvo(){
		DbPageVO vo = new DbPageVO();
		vo.currentpage = 1;
		vo.pagecount = 0;
		vo.pagesize = 15;
		vo.rowcount = 0;
		return vo;
	}
	public int getCurrentpage() {
		return currentpage;
	}
	public void setCurrentpage(int currentpage) {
		this.currentpage = currentpage;
	}
	public int getPagecount() {
		return pagecount;
	}
	public void setPagecount(int pagecount) {
		this.pagecount = pagecount;
	}
	public int getPagesize() {
		return pagesize;
	}
	public void setPagesize(int pagesize) {
		this.pagesize = pagesize;
	}
	public int getRowcount() {
		return rowcount;
	}
	public void setRowcount(int rowcount) {
		this.rowcount = rowcount;
	}

}
