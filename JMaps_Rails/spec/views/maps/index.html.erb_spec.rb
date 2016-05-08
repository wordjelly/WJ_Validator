require 'rails_helper'

RSpec.describe "maps/index", type: :view do
  before(:each) do
    assign(:maps, [
      Map.create!(
        :schema => "MyText"
      ),
      Map.create!(
        :schema => "MyText"
      )
    ])
  end

  it "renders a list of maps" do
    render
    assert_select "tr>td", :text => "MyText".to_s, :count => 2
  end
end
