json.array!(@maps) do |map|
  json.extract! map, :id, :schema
  json.url map_url(map, format: :json)
end
