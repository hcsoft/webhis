package hcsoft.dbpage;

public class PageVO {
	private int pagesize;
	private int currentpage;
	private int pagecount;
	private int rowcount;
	
	public static PageVO defaultvo(){
		PageVO vo = new PageVO();
		vo.setCurrentpage(1);
		vo.setPagecount(0);
		vo.setPagesize(20);
		vo.setRowcount(0);
		return vo;
	}
	
	public int getPagesize() {
		return pagesize;
	}
	public void setPagesize(int pagesize) {
		this.pagesize = pagesize;
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
	public int getRowcount() {
		return rowcount;
	}
	public void setRowcount(int rowcount) {
		this.rowcount = rowcount;
	}
	
}
